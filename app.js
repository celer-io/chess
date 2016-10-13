'use strict'
const board = require('./board')
const _ = require('ramda')
const M = require('./utils/matrix')
const Rules = require('./rules')

// const trace = _.curry(function(tag, x) {
//   console.log(tag, x)
//   return x
// })

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
// const onPieceDragLeave = ev => unSetMoveTarget(ev.target.parentNode)

document.addEventListener('DOMContentLoaded', () => {
  // let game = startGame()
  let game = initGame()
  const getData = ev => JSON.parse(ev.dataTransfer.getData('text/plain'))
  const setData = (ev, data) => ev.dataTransfer.setData('text/plain', JSON.stringify(data))

  const handleInstructions = instructions => {
    if (instructions.error) return console.warn(instructions.error)

    game.matrix = instructions.newMatrix    // Unsafe

    updatePiece(instructions.update)
    _.forEach(deletePiece, instructions.deletes)
  }

  const onSquareDrop = ev => {
    ev.preventDefault()
    const origin = getData(ev)
    const destination = ev.target.classList.contains('piece') ? ev.target.parentNode.id : ev.target.id
    const instructions = Rules.getMoveInstructions(game.matrix, origin, destination)
    handleInstructions(instructions)
  }

  const onPieceDragStart = ev => {
    board.clearLastMove()
    const position = ev.currentTarget.parentNode.id
    console.log('possibleMoves :', Rules.getPossibleMoves(game.matrix, position))
    setData(ev, position)
    setMoveSource(ev.currentTarget.parentNode)
    // TODO: for nice drag and drop in chrome
    var img = ev.currentTarget.cloneNode()
    document.getElementById('img-box').appendChild(img)

    ev.dataTransfer.setDragImage(img, 25, 25)
  }

  const deletePiece = slug => document.getElementById(slug).remove()

  const updatePiece = update => document.getElementById(update.position).appendChild(document.getElementById(update.slug))

  const createPiece = piece => board.drawPiece(piece.position, board.createPiece(piece.color, piece.type, piece.id)) // To refactor

  // matrix
  const draw = _.compose(_.forEach(createPiece), _.reject(_.isNil), _.flatten)

  draw(game.matrix)

  // matrix
  const whiteArmy = _.compose(_.filter(_.propEq('color', 'white')), _.reject(_.isNil), _.flatten)

  // piece
  const setDraggable = _.compose(addListener('dragstart', onPieceDragStart), board.setDraggableAt, _.prop('position'))

  // matrix
  const setWhiteArmyDraggable = _.compose(_.forEach(setDraggable), whiteArmy)

  setWhiteArmyDraggable(game.matrix)

  board.getSquares().forEach((square) => {
    square.addEventListener('dragover', onSquareDragOver, false)
    square.addEventListener('dragenter', onSquareDragEnter, false)
    square.addEventListener('dragleave', onSquareDragLeave, false)
    square.addEventListener('drop', onSquareDrop, false)
  })
})

// TODO: put this in Rules and remove M dependency in app
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

  // initialSet.forEach(M.set(matrix, M.coords(_.prop('position'))))
  _.forEach(piece => {
    matrix = M.set(matrix, M.coords(_.prop('position', piece)), piece)
  }, initialSet)

  return {matrix}
}
