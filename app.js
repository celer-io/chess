'use strict'
const Board = require('./board')
const M = require('./utils/matrix')
const Rules = require('./rules')
const _ = require('ramda')

// const trace = _.curry((tag, x) => {
//   console.log(tag, x)
//   return x
// })

document.addEventListener('DOMContentLoaded', () => {
  const game = Rules.gameOf('classic', 'classic')

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
    Board.showPossibleMoves(Rules.getPossibleMoves(game.matrix, position))
    Board.setData(ev, position)
    Board.setMoveSource(ev.currentTarget.parentNode)
    // Board.niceDragImage(ev)
  }

  // const setDraggable = _.compose(
  //   Board.addListener('dragstart', onPieceDragStart),
  //   Board.setDraggable
  // )

  const setWhiteArmyDraggable = (matrix) => _.compose(
    _.forEach(Board.setDraggable(onPieceDragStart)),
    M.getWhites
  )(matrix)

  const onSquareDragOver = ev => ev.preventDefault()
  const onSquareDragEnter = ev => {
    if (!ev.target.classList.contains('piece')) {
      Board.setMoveTarget(ev.target)
    }
  }

  const onSquareDragLeave = ev => Board.unSetMoveTarget(ev.target)

  // const onPieceDragLeave = ev => unSetMoveTarget(ev.target.parentNode)

  Board.drawMatrix(game.matrix)
  // const setDraggable = _.compose(
  //   Board.addListener('dragstart', onPieceDragStart),
  //   Board.setDraggable
  // )

  // const setWhiteArmyDraggable = _.compose(_.forEach(setDraggable), M.getWhites)

  setWhiteArmyDraggable(game.matrix)

  _.forEach((square) => {
    Board.addListener('dragover', onSquareDragOver, square)
    Board.addListener('dragenter', onSquareDragEnter, square)
    Board.addListener('dragleave', onSquareDragLeave, square)
    Board.addListener('drop', onSquareDrop, square)
  }, Board.getSquaresEl())
})
