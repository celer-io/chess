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
  document.getElementById('startButton').onclick = () => {
    const onSquareDrop = ev => {
      ev.preventDefault()
      const origin = Board.getData(ev)
      const squareTarget = ev.target.classList.contains('piece') ? ev.target.parentNode : ev.target
      Board.clearAvailableMoves()

      const destination = squareTarget.id
      const instructions = Rules.getMoveInstructions(game, origin, destination)

      applyInstructions(instructions)
    }
    const applyInstructions = (instructions) => {
      game = Game.nextState(game, instructions)
      // print(game, instructions)
      if (instructions.error) {
        return console.warn(instructions.error)
      }

      Board.drawInstructions(instructions)

      Board.clearDraggables(game.matrix)
      const state = _.prop('state', game)

      if (_.propEq('name', 'turn', state)) {
        Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
      } else if (_.propEq('name', 'in_check', state)) {
        Board.setArmyDraggable(game.matrix, state.player, onPieceDragStart)
      }

      if (_.propEq('name', 'in_check', state)) {
        console.warn(state.player + ' player is in check')
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
    const onPieceDragStart = ev => {
      Board.clearMoves()
      const position = ev.currentTarget.parentNode.id
      Board.showPossibleMoves(game.possibleMoves, position)
      Board.setData(ev, position)
      // Board.niceDragImage(ev)
    }
    const onSquareDragOver = ev => ev.preventDefault()

    const onSquareDragLeave = ev => Board.unSetMoveTarget(ev.target)
    let whiteArmyType = document.getElementById('whiteArmyType').value
    let blackArmyType = document.getElementById('blackArmyType').value

    let game = Game.of(whiteArmyType, blackArmyType)
    Board.drawMatrix(game.matrix)
    document.getElementById('dashboard').style.display = 'none'
    document.getElementById('board').style.display = 'block'

    Board.setWhiteArmyDraggable(game.matrix, onPieceDragStart)
    Board.setSquaresHandlers({
      onSquareDragOver,
      onSquareDragLeave,
      onSquareDrop
    })
  }
})
