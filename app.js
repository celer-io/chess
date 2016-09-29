'use strict'
const board = require('./board.js')
const _ = require('ramda')
const M = require('./matrix-utils.js')

const trace = _.curry(function(tag, x) {
  console.log(tag, x)
  return x
})

const addListener = _.curry((eventName, handler, element) => element.addEventListener(eventName, handler, true))
const addClass = _.curry((className, element) => element.classList.add(className))
const removeClass = _.curry((className, element) => element.classList.remove(className))

const setMoveTarget = addClass('move-target')
const unSetMoveTarget = removeClass('move-target')
const setMoveSource = addClass('move-source')

const onSquareDragOver = ev => ev.preventDefault()
const onSquareDragEnter = ev => setMoveTarget(ev.target)
const onPieceDragEnter = ev => setMoveTarget(ev.target.parentNode)
const onSquareDragLeave = ev => unSetMoveTarget(ev.target)
const onPieceDragLeave = ev => unSetMoveTarget(ev.target.parentNode)

const whitePawnMoves = [
  {y: 1, x: 0},
  {y: 1, x: 1},
  {y: 1, x: -1}
]

const blackPawnMoves = [
  {y: -1, x: 0},
  {y: -1, x: 1},
  {y: -1, x: -1}
]

const knightMoves = [
  {y: 2, x: 1},
  {y: 2, x: -1},
  {y: 1, x: 2},
  {y: -1, x: 2},
  {y: -2, x: 1},
  {y: -2, x: -1},
  {y: 1, x: -2},
  {y: -1, x: -2}
]

const rookMoves = _.flatten([
  _.times((x) => ({y: 0, x: 1+x}), 7),
  _.times((x) => ({y: 0, x: -1-x}), 7),
  _.times((y) => ({y: 1+y, x: 0}), 7),
  _.times((y) => ({y: -1-y, x: 0}), 7)
])

const bishopMoves = _.flatten([
  _.times((n) => ({y: 1+n, x: 1+n}), 7),
  _.times((n) => ({y: -1-n, x: -1-n}), 7),
  _.times((n) => ({y: 1+n, x: -1-n}), 7),
  _.times((n) => ({y: -1-n, x: 1+n}), 7)
])

const queenMoves = _.flatten([rookMoves, bishopMoves])

const whiteArmyMoves = {
  pawn: whitePawnMoves,
  knight: knightMoves,
  rook: rookMoves,
  bishop: bishopMoves,
  queen: queenMoves
}

// const rookMoves = _.forEach(_.times(_._, 7), [
//   (x) => ({y: 0, x: 1+x}),
//   (x) => ({y: 0, x: -1-x}),
//   (y) => ({y: 1+y, x: 0}),
//   (y) => ({y: -1-y, x: 0})
// ])

const possibleMoves = (matrix, position) => {
  const piece = M.getPieceAtPosition(matrix, position)

  if (piece.color === 'white') {
    return whiteArmyMoves[piece.type].map(t => {
      return M.getTransformed(position, t)
    })
  }

  return []
}


const movePiece = (matrix, origin, destination) => {
  return new Promise((resolve, reject) => {
    const moves = possibleMoves(matrix, origin)

    // if (_.not(_.any(_.equals(destination), moves))) reject('noop')

    console.log("moves", moves);

    let res = {
      updates: [],
      deletes: []
    };

    const pieceOnTarget = M.getPieceAtPosition(matrix, destination)

    console.log('pieceOnTarget', pieceOnTarget);
    if (pieceOnTarget) res.deletes.push(getSlug(pieceOnTarget))

    console.log('slug', getSlug(M.getPieceAtPosition(matrix, origin)));
    res.updates.push({
      position: destination,
      slug: getSlug(M.getPieceAtPosition(matrix, origin))
    })

    console.log('res', res);

    resolve(res)
  })
}

const getSlug = piece => piece.color + piece.type + piece.id

document.addEventListener('DOMContentLoaded', () => {
  let gameMatrix = initGame()

  const getData = ev => JSON.parse(ev.dataTransfer.getData('text/plain'))
  const setData = (ev, data) => ev.dataTransfer.setData('text/plain', JSON.stringify(data))

  const onSquareDrop = ev => {
    ev.preventDefault()
    const origin = getData(ev)
    const destination = ev.target.classList.contains('piece') ? ev.target.parentNode : ev.target
    // let pieceEl
    // if (squareEl.classList.contains('piece')) {
    //   squareEl = ev.target.parentNode
    //   // pieceEl = ev.target
    // }

    movePiece(gameMatrix, origin, destination).then((res) => {
      _.forEach(updatePiece, res.updates)
      _.forEach(deletePiece, res.deletes)
    }, (err) => {
      console.log('err', err);
      if (err) throw err
      // board.clearLastMove()
    })

    // // TODO : handle move and remove piece from from rules within matrix and not in the event
    // if (data.possibleMoves.indexOf(squareEl.id) === -1) { //THis is ugly
    //   return // this is also ugly
    // }




    // promise ??? yup yup
    // if (pieceEl) pieceEl.remove()

    // END
  }

  const onPieceDragStart = ev => {
    // let data = {
    //   originPosition: ev.currentTarget.parentNode.id,
    //   pieceSlug: ev.currentTarget.id,
    // }
    board.clearLastMove()
    // data.possibleMoves = possibleMoves(gameMatrix, data.originPosition)
    // console.log(data.possibleMoves);
    setData(ev, ev.currentTarget.parentNode.id)
    setMoveSource(ev.currentTarget.parentNode)
    // TODO: for nice drag and drop in chrome
    // event.dataTransfer.setDragImage(image, xOffset, yOffset)
  }

  const deletePiece = slug => document.getElementById(slug).remove()

  const updatePiece = update => document.getElementById(update.position).appendChild(document.getElementById(update.slug))

  const createPiece = piece => board.drawPiece(piece.position, board.createPiece(piece.color, piece.type, piece.id))//To refactor

  const notNil = _.compose(_.not, _.isNil)

  //matrix
  const draw = _.compose(_.forEach(createPiece),_.filter(notNil),_.flatten)

  draw(gameMatrix)

  //matrix
  const whiteArmy = _.compose(_.filter(_.propEq('color','white')), _.filter(notNil), _.flatten)

  //piece
  const setDraggable = _.compose(addListener('dragstart', onPieceDragStart), board.setDraggableAt, _.prop('position'))


  //matrix
  const setWhiteArmyDraggable = _.compose(_.forEach(setDraggable), whiteArmy)

  setWhiteArmyDraggable(gameMatrix)


  board.getSquares().forEach((square) => {
    square.addEventListener('dragover', onSquareDragOver, false)
    square.addEventListener('dragenter', onSquareDragEnter, false)
    square.addEventListener('dragleave', onSquareDragLeave, false)
    square.addEventListener('drop', onSquareDrop, false)
  })
})

function initGame () {
  let matrix = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
  ]

  let initialSet = [
    {type: 'king', id: '', color: 'white', armyType: 'classic', position: 'e1'},
    {type: 'queen', id: '', color: 'white', armyType: 'classic', position: 'd1'},
    {type: 'rook', id: '1', color: 'white', armyType: 'classic', position: 'a1'},
    {type: 'rook', id: '2', color: 'white', armyType: 'classic', position: 'h1'},
    {type: 'bishop', id: '1', color: 'white', armyType: 'classic', position: 'c1'},
    {type: 'bishop', id: '2', color: 'white', armyType: 'classic', position: 'f1'},
    {type: 'knight', id: '1', color: 'white', armyType: 'classic', position: 'b1'},
    {type: 'knight', id: '2', color: 'white', armyType: 'classic', position: 'g1'},
    {type: 'pawn', id: '1', color: 'white', armyType: 'classic', position: 'a2'},
    {type: 'pawn', id: '2', color: 'white', armyType: 'classic', position: 'b2'},
    {type: 'pawn', id: '3', color: 'white', armyType: 'classic', position: 'c2'},
    {type: 'pawn', id: '4', color: 'white', armyType: 'classic', position: 'd2'},
    {type: 'pawn', id: '5', color: 'white', armyType: 'classic', position: 'e2'},
    {type: 'pawn', id: '6', color: 'white', armyType: 'classic', position: 'f2'},
    {type: 'pawn', id: '7', color: 'white', armyType: 'classic', position: 'g2'},
    {type: 'pawn', id: '8', color: 'white', armyType: 'classic', position: 'h2'},

    {type: 'king', id: '', color: 'black', armyType: 'classic', position: 'e8'},
    {type: 'queen', id: '', color: 'black', armyType: 'classic', position: 'd8'},
    {type: 'rook', id: '1', color: 'black', armyType: 'classic', position: 'a8'},
    {type: 'rook', id: '2', color: 'black', armyType: 'classic', position: 'h8'},
    {type: 'bishop', id: '1', color: 'black', armyType: 'classic', position: 'c8'},
    {type: 'bishop', id: '2', color: 'black', armyType: 'classic', position: 'f8'},
    {type: 'knight', id: '1', color: 'black', armyType: 'classic', position: 'b8'},
    {type: 'knight', id: '2', color: 'black', armyType: 'classic', position: 'g8'},
    {type: 'pawn', id: '1', color: 'black', armyType: 'classic', position: 'a7'},
    {type: 'pawn', id: '2', color: 'black', armyType: 'classic', position: 'b7'},
    {type: 'pawn', id: '3', color: 'black', armyType: 'classic', position: 'c7'},
    {type: 'pawn', id: '4', color: 'black', armyType: 'classic', position: 'd7'},
    {type: 'pawn', id: '5', color: 'black', armyType: 'classic', position: 'e7'},
    {type: 'pawn', id: '6', color: 'black', armyType: 'classic', position: 'f7'},
    {type: 'pawn', id: '7', color: 'black', armyType: 'classic', position: 'g7'},
    {type: 'pawn', id: '8', color: 'black', armyType: 'classic', position: 'h7'}
  ]

  initialSet.forEach(piece => {
    matrix = M.setPieceAt(matrix, piece.position, piece)
  })

  return matrix
}
