'use strict'
const Board = require('./board')
const Rules = require('./rules')
const Game = require('./game')
const _ = require('ramda')
// const M = require('./utils/matrix')

// const trace = _.curry((tag, x) => {
//   console.log(tag, x)
//   return x
// })

document.addEventListener('DOMContentLoaded', () => {
  let game = Game.of('classic', 'classic') // Variables lives freely into the game ui loop :)

  const onSquareDrop = ev => {
    ev.preventDefault()
    const origin = Board.getData(ev)
    const squareTarget = ev.target.classList.contains('piece') ? ev.target.parentNode : ev.target
    Board.clearAvailableMoves()

    const destination = squareTarget.id
    const instructions = Rules.getMoveInstructions(game.matrix, origin, destination)

    if (!instructions.error) { // TODO: move into instructions handling
      Board.setMoveTarget(squareTarget)
      Board.setMoveSource(Board.getSquareEl(origin))
    }

    handleInstructions(instructions)
  }

  const onPieceDragStart = ev => {
    Board.clearMoves()
    const position = ev.currentTarget.parentNode.id
    Board.showPossibleMoves(Rules.getPossibleMoves(game.matrix, position))
    Board.setData(ev, position)
    // Board.niceDragImage(ev)
  }

  const onSquareDragOver = ev => ev.preventDefault()
  // const onSquareDragEnter = ev => {
  //   Board.setMoveTarget(ev.target)
  // }

  const print = (game, instructions) => {
    if (instructions.error) {
      return console.warn(instructions.error)
    }

    Board.drawInstructions(instructions)

    // Board.clearDraggables(game.matrix) // XXX : commented for development
    const state = _.prop('state', game)

    if (_.propEq('name', 'turn', state)) {
      Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
    } else if (_.propEq('name', 'in_check', state)) {
      console.warn(state.player + ' player is in check !')
      Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
    } else if (_.propEq('name', 'in_checkmate', state)) {
      console.warn(state.player + ' player is in checkmate !')
      // Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
    } else if (_.propEq('name', 'in_stalemate', state)) {
      console.warn(state.player + ' player is in stalemate !')
      // Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
    }
    // if (game.state === 'white_turn') {
    // } else if (game.state === 'black_turn') {
    //   Board.setBlackArmyDraggable(game.matrix, onPieceDragStart)
    // }

    // TODO: display state on dashboard (and handle animations...)
    // Dashboard.print(game)
  }

  const handleInstructions = instructions => {
    game = Game.nextState(game, instructions)
    print(game, instructions)
  }

  const onSquareDragLeave = ev => Board.unSetMoveTarget(ev.target)

  Board.drawMatrix(game.matrix)

  Board.setWhiteArmyDraggable(game.matrix, onPieceDragStart)
  Board.setSquaresHandlers({
    onSquareDragOver,
    onSquareDragLeave,
    onSquareDrop
  })
})
