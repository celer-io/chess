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
    const instructions = Rules.getMoveInstructions(game, origin, destination)

    if (!instructions.error) { // TODO: move into instructions handling
      Board.setMoveTarget(squareTarget)
      Board.setMoveSource(Board.getSquareEl(origin))
    }

    handleInstructions(instructions)
  }

  const onPieceDragStart = ev => {
    Board.clearMoves()
    const position = ev.currentTarget.parentNode.id
    Board.showPossibleMoves(game.possibleMoves, position)
    Board.setData(ev, position)
    // Board.niceDragImage(ev)
  }

  const onSquareDragOver = ev => ev.preventDefault()

  const print = (game, instructions) => {
    if (instructions.error) {
      return console.warn(instructions.error)
    }

    Board.drawInstructions(instructions)

    Board.clearDraggables(game.matrix)
    const state = _.prop('state', game)

    if (_.propEq('name', 'turn', state)) {
      Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
    } else if (_.propEq('name', 'in_check', state)) {
      console.warn(state.player + ' player is in check')
      Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
    } else if (_.propEq('name', 'won_by_checkmate', state)) {
      console.warn(state.player + ' player won by checkmate')
    } else if (_.propEq('name', 'won_by_stalemate', state)) {
      console.warn(state.player + ' player won by stalemate')
    } else if (_.propEq('name', 'won_by_midline', state)) {
      console.warn(state.player + ' player won by midline invasion')
    }

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
