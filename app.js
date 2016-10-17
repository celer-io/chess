'use strict'
const Board = require('./board')
const M = require('./utils/matrix')
const Rules = require('./rules')
const _ = require('ramda')

// const trace = _.curry(function(tag, x) {
//   console.log(tag, x)
//   return x
// })

document.addEventListener('DOMContentLoaded', () => {
  // let game = startGame()
  let game = initGame()
  console.log('game.matrix :', game.matrix)
  const handleInstructions = instructions => {
    if (instructions.error) return console.warn(instructions.error)

    game.matrix = instructions.newMatrix    // Unsafe

    Board.updatePiece(instructions.update)
    _.forEach(Board.deletePiece, instructions.deletes)
  }

  const onSquareDrop = ev => {
    ev.preventDefault()
    const origin = Board.getData(ev)
    const destination = ev.target.classList.contains('piece') ? ev.target.parentNode.id : ev.target.id
    const instructions = Rules.getMoveInstructions(game.matrix, origin, destination)
    handleInstructions(instructions)
  }

  const onPieceDragStart = ev => {
    Board.clearLastMove()
    const position = ev.currentTarget.parentNode.id
    console.log('possibleMoves :', Rules.getPossibleMoves(game.matrix, position))
    Board.showPossibleMoves(Rules.getPossibleMoves(game.matrix, position))
    Board.setData(ev, position)
    Board.setMoveSource(ev.currentTarget.parentNode)
    Board.niceDragImage(ev)
  }

  const setDraggable = _.compose(Board.addListener('dragstart', onPieceDragStart), Board.setDraggableAt, _.prop('position'))

  const setWhiteArmyDraggable = _.compose(_.forEach(setDraggable), M.getWhites)

  const onSquareDragOver = ev => ev.preventDefault()
  const onSquareDragEnter = ev => {
    if (!ev.target.classList.contains('piece')) {
      Board.setMoveTarget(ev.target)
    }
  }

  const onSquareDragLeave = ev => Board.unSetMoveTarget(ev.target)

  // const onPieceDragLeave = ev => unSetMoveTarget(ev.target.parentNode)

  Board.drawMatrix(game.matrix)

  setWhiteArmyDraggable(game.matrix)

  _.forEach(Board.getSquaresEl(), (square) => {
    Board.addListener('dragover', onSquareDragOver, square)
    Board.addListener('dragenter', onSquareDragEnter, square)
    Board.addListener('dragleave', onSquareDragLeave, square)
    Board.addListener('drop', onSquareDrop, square)
  })
})

// TODO: put this in Rules and remove M dependency in app
function initGame () {
  const emptyMatrix = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
  ]

  const initialSet = [
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
  console.log('emptyMatrix :', emptyMatrix)
  console.log('initialSet :', initialSet)

  const appendPiece = (matrix, piece) => {
    console.log('matrix :', matrix)
    return M.set(matrix, M.coords(piece.position), _.omit(['position'], piece))
  }

  return _.reduce(appendPiece, emptyMatrix, initialSet)
}
