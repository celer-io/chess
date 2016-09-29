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

const possibleMoves = (matrix, position) => {
  console.log('position', position);
  console.log('matrix', matrix);
  const piece = M.getPieceAtPosition(matrix, position)

  if (piece.type === 'pawn' && piece.color === 'white') {
    return whitePawnMoves.map(t => {
      return M.getTransformed(position, t)
    })
  }

  return []
}

document.addEventListener('DOMContentLoaded', () => {
  let gameMatrix = initGame()

  const getData = ev => JSON.parse(ev.dataTransfer.getData('text/plain'))
  const setData = (ev, data) => ev.dataTransfer.setData('text/plain', JSON.stringify(data))

  const onSquareDrop = ev => {
    ev.preventDefault()
    const data = getData(ev)
    let squareEl = ev.target
    let pieceEl
    if (squareEl.classList.contains('piece')) {
      squareEl = ev.target.parentNode
      pieceEl = ev.target
    }

    if (data.possibleMoves.indexOf(squareEl.id) === -1) { //THis is ugly
      console.log('not availableTargets')
      board.clearLastMove()
      return // this is also ugly
    }

    // TODO : handle move and remove piece from from rules within matrix and not in the event
    // promise ??? yup yup
    const newPieceEl = document.getElementById(data.pieceSlug)
    if (pieceEl) pieceEl.remove()
    squareEl.appendChild(newPieceEl)
    // END
  }

  const onPieceDragStart = ev => {
    let data = {
      originPosition: ev.currentTarget.parentNode.id,
      pieceSlug: ev.currentTarget.id,
    }
    board.clearLastMove()
    data.possibleMoves = possibleMoves(gameMatrix, data.originPosition)
    console.log(data.possibleMoves);
    setData(ev, data)
    setMoveSource(ev.currentTarget.parentNode)
    // TODO: for nice drag and drop in chrome
    // event.dataTransfer.setDragImage(image, xOffset, yOffset)
  }

  const drawPiece = piece => board.drawPiece(piece.position, board.createPiece(piece.color, piece.type, piece.id))//To refactor

  const notNil = _.compose(_.not, _.isNil)

  //matrix
  const draw = _.compose(_.forEach(drawPiece),_.filter(notNil),_.flatten)

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
