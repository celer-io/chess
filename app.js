'use strict'
const board = require('./board.js')
const _ = require('ramda')
const M = require('./matrix-utils.js')
const notNil = _.compose(_.not, _.isNil)

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
const onSquareDragEnter = ev => {
  if (!ev.target.classList.contains('piece')) {
    setMoveTarget(ev.target)
  }
}
const onSquareDragLeave = ev => unSetMoveTarget(ev.target)
const onPieceDragLeave = ev => unSetMoveTarget(ev.target.parentNode)

const whitePawnMoves = (matrix, coords) => {
  const sideMoves = _.filter(M.anyPieceAfterTransform(matrix, coords), [{x:-1, y:-1}, {x:-1, y:1}])

  let moves = [{
    update: {x: -1, y: 0},
    deletes: []
  }]

  // TODO: get rid of mutation with lensMoves
  if (coords.x === 6) {
    moves = _.append({
      update: {x: -2, y: 0},
      deletes: []
    }, moves)

    //TODO : Implement enpassant
    moves = _.append(_.map(move => ({
      update: move,
      deletes: [move]
    }), sideMoves), moves)

    moves = _.flatten(moves)
  }
  return _.filter(notNil, _.map(M.transformMove(coords), moves))
}

const knightMoves = (matrix, coords) => {
  const possibles = [
    {x:2, y: 1},
    {x:2, y: -1},
    {x:1, y: 2},
    {x:-1, y: 2},
    {x:-2, y: 1},
    {x:-2, y: -1},
    {x:1, y: -2},
    {x:-1, y: -2}
  ]

  const moves = _.map( possible => ({
    update: possible,
    deletes: M.anyPieceAfterTransform(matrix, coords, possible) ? [possible] : []
  }), possibles)

  return _.filter(notNil, _.map(M.transformMove(coords), moves))
}

// const absolute = x => (x > 0) ? x : 0 - x //useless stuff ?

//      y0 y1 y2 y3 y4 y5 y6 y7
// x0 [[a8,b8,c8,d8,e8,f8,g8,h8],
// x1  [a7,b7,c7,d7,e7,f7,g7,h7],
// x2  [a6,b6,c6,d6,e6,f6,g6,h6],
// x3  [a5,b5,c5,d5,e5,f5,g5,h5],
// x4  [a4,b4,c4,d4,e4,f4,g4,h4],
// x5  [a3,b3,c3,d3,e3,f3,g3,h3],
// x6  [a2,b2,c2,d2,e2,f2,g2,h2],
// x7  [a1,b1,c1,d1,e1,f1,g1,h1]]
const isWhite => _.propEq('color', 'white')

const rookMoves = (matrix, coords) => {
  const xMoves = _.map(x => ({x: x+1, y: 0}), _.times(_.subtract(coords.x), 7))
  const yMoves = _.map(y => ({x: 0, y: y+1}), _.times(_.subtract(coords.y), 7))

  const possiblesXup = _.map(x => ({x: x+1, y: 0}), _.times(_.subtract(coords.x), 7))
  const possiblesYup
  const possiblesXdown
  const possiblesYdown

  const possibles = coords =>  _.concat(xMoves, yMoves)

  const appendMove = (moves, move) => {
    const transformed = M.transform(move)
    const piece = M.get(transformed)

    if (!piece) return _.append({ update: transformed, deletes: []}, moves)
    if (isWhite(piece)) return _.reduced(moves)
    return _.append({ update: transformed, deletes: [transformed] }, moves)
  }

  return _.compose(
    _.reduce(appendMove, _._, possiblesXup),
    _.reduce(appendMove, _._, possiblesYup),
    _.reduce(appendMove, _._, possiblesXdown),
    _.reduce(appendMove, [], possiblesYdown)
  ) ([])
}
//
// const bishopMoves = _.flatten([
//   _.times((n) => ({y: 1+n, x: 1+n}), 7),
//   _.times((n) => ({y: -1-n, x: -1-n}), 7),
//   _.times((n) => ({y: 1+n, x: -1-n}), 7),
//   _.times((n) => ({y: -1-n, x: 1+n}), 7)
// ])
//
// const queenMoves = _.flatten([rookMoves, bishopMoves])

const whiteArmyMoves = {
  pawn: whitePawnMoves,
  knight: knightMoves,
  rook: rookMoves
  // bishop: bishopMoves,
  // queen: queenMoves
}


const movesOf = (piece) => {
  if (piece.color === 'black') return []

  return whiteArmyMoves[piece.type]
}


const toInstructions = _.curry((matrix, origin, move) => {
  const slugAt = _.curry((matrix, coords) => getSlug(M.get(matrix, coords)))
  // TODO: replace with lenses ? meh...
  const update = _.prop('update', move)
  const deletes = _.prop('deletes', move)

  return {
    orgin: origin,
    animation: null,
    update: {
      position: M.position(update),
      slug: slugAt(matrix, origin)
    },
    deletes: _.unless(_.isEmpty, _.map(slugAt(matrix))) (deletes),
    newMatrix: M.applyMove(matrix, move, origin)
  }
})

const getMoveInstructions = (matrix, originPosition, target) => {
  const origin = M.coords(originPosition)
  const destination = M.coords(target)
  const piece = M.get(matrix, origin)
  const moves = movesOf(piece) (matrix, origin)
  // TODO: change _.prop('update') to someting more appropriate when possible move will not (only) be defined by update
  const move = _.find(_.propEq('update', destination), moves)
  if (!move) return { error: 'no-can-move' }
  return toInstructions(matrix, origin, move)
}

const getPossibleMoves = (matrix, originPosition) => {
  const origin = M.coords(originPosition)
  const piece = M.get(matrix, origin)
  const moves = movesOf(piece) (matrix, origin)
  return _.map(toInstructions(matrix, origin), moves)
}

const getSlug = piece => piece.color + piece.type + piece.id

document.addEventListener('DOMContentLoaded', () => {
  // let game = startGame()
  let game = initGame()
  const getData = ev => JSON.parse(ev.dataTransfer.getData('text/plain'))
  const setData = (ev, data) => ev.dataTransfer.setData('text/plain', JSON.stringify(data))

  const handleInstructions = instructions => {
    if (instructions.error) return console.warn(instructions.error)

    game.matrix = instructions.newMatrix    //Unsafe

    updatePiece(instructions.update)
    _.forEach(deletePiece, instructions.deletes)
  }

  const onSquareDrop = ev => {
    ev.preventDefault()
    const origin = getData(ev)
    const destination = ev.target.classList.contains('piece') ? ev.target.parentNode.id : ev.target.id
    const instructions = getMoveInstructions(game.matrix, origin, destination)
    handleInstructions(instructions)
  }

  const onPieceDragStart = ev => {
    board.clearLastMove()

    setData(ev, ev.currentTarget.parentNode.id)
    setMoveSource(ev.currentTarget.parentNode)
    // TODO: for nice drag and drop in chrome
    var img = ev.currentTarget.cloneNode()
    document.getElementById('img-box').appendChild(img)

    ev.dataTransfer.setDragImage(img, 25, 25)
  }

  const deletePiece = slug => document.getElementById(slug).remove()

  const updatePiece = update => document.getElementById(update.position).appendChild(document.getElementById(update.slug))

  const createPiece = piece => board.drawPiece(piece.position, board.createPiece(piece.color, piece.type, piece.id))//To refactor

  //matrix
  const draw = _.compose(_.forEach(createPiece),_.filter(notNil),_.flatten)

  draw(game.matrix)

  //matrix
  const whiteArmy = _.compose(_.filter(_.propEq('color','white')), _.filter(notNil), _.flatten)

  //piece
  const setDraggable = _.compose(addListener('dragstart', onPieceDragStart), board.setDraggableAt, _.prop('position'))


  //matrix
  const setWhiteArmyDraggable = _.compose(_.forEach(setDraggable), whiteArmy)

  setWhiteArmyDraggable(game.matrix)


  board.getSquares().forEach((square) => {
    square.addEventListener('dragover', onSquareDragOver, false)
    square.addEventListener('dragenter', onSquareDragEnter, false)
    square.addEventListener('dragleave', onSquareDragLeave, false)
    square.addEventListener('drop', onSquareDrop, false)
  })
})

function initGame() {
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

  // initialSet.forEach(M.set(matrix, M.coords(_.prop('position'))))
  _.forEach(piece => {
    matrix = M.set(matrix, M.coords(_.prop('position', piece)), piece)
  }, initialSet)

  return {matrix}
}
