'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')
const Rules = require('./rules')

const emptyMatrix = [ // TODO: codegolf !
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8)
]

const stateOf = _.curry((player, name) => ({player, name}))
const lensPLayer = _.lensProp('player')
const lensName = _.lensProp('name')
const nextState = (game, instructions) => {
  if (_.prop('error', instructions)) return game

  const oponent = Rules.oponentColor(_.path(['state', 'player'], game))
  const matrix = _.prop('matrix', instructions)
  let state = _.clone(_.prop('state', game))

  if (_.any(_.propEq('name', _.__, state), ['turn', 'in_check'])) {
    state = _.set(lensPLayer, oponent, state)
  }

  const possibleMoves = Rules.getPossibleMoves(matrix, state.player)

  if (Rules.isInCheck(matrix, state.player)) {
    state = _.set(lensName, 'in_check', state)
    if (!possibleMoves.length) {
      state = _.set(lensName, 'in_checkmate', state)
    }
  } else if (!possibleMoves.length) {
    state = _.set(lensName, 'in_stalemate', state)
  } else {
    state = _.set(lensName, 'turn', state)
  }

  return {
    state,
    matrix,
    possibleMoves
  }
}

const of = (blackArmyType, whiteArmyType) => {
  // TODO: use coords for position
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

  const appendPiece = (matrix, piece) => {
    return M.set(matrix, M.coords(piece.position), _.omit(['position'], piece))
  }

  const matrix = _.reduce(appendPiece, emptyMatrix, initialSet)

  return {
    state: stateOf('white', 'turn'),
    matrix,
    possibleMoves: Rules.getPossibleMoves(matrix, 'white')
  }
}

module.exports = {
  of,
  nextState
}
