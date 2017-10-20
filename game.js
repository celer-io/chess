'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')
const Rules = require('./rules')

const emptyMatrix = _.times(x => new Array(8), 8)

const stateOf = _.curry((player, name) => ({player, name}))
// state: {
//   player: String, // white|black
//   name: String  //turn|in_check|duel|king_turn\won_by_stalemate|won_by_checkmate|won_by_midline...
// }

const nextState = (game, instructions) => {
  if (_.prop('error', instructions)) return game

  const player = _.path(['state', 'player'], game)
  const oponent = Rules.oponentColor(player)
  const matrix = _.prop('matrix', instructions)

  if (Rules.isMidlineInvasion(matrix, player)) return { state: stateOf(player, 'won_by_midline'), matrix }

  const possibleMoves = Rules.getPossibleMoves(matrix, oponent)
  const isInCheck = Rules.isInCheck(matrix, oponent)

  if (!possibleMoves.length && isInCheck) return { state: stateOf(player, 'won_by_checkmate'), matrix }
  if (!possibleMoves.length && !isInCheck) return { state: stateOf(player, 'won_by_stalemate'), matrix }

  return {
    state: {
      player: oponent,
      name: isInCheck ? 'in_check' : 'turn'
    },
    matrix,
    possibleMoves
  }
}

const of = (blackArmyType, whiteArmyType) => {
  // TODO: use coords for position
  const initialSet = [
    {type: 'king', id: '', color: 'white', armyType: blackArmyType, position: 'e1'},
    {type: 'queen', id: '', color: 'white', armyType: blackArmyType, position: 'd1'},
    {type: 'rook', id: '1', color: 'white', armyType: blackArmyType, position: 'a1'},
    {type: 'rook', id: '2', color: 'white', armyType: blackArmyType, position: 'h1'},
    {type: 'bishop', id: '1', color: 'white', armyType: blackArmyType, position: 'c1'},
    {type: 'bishop', id: '2', color: 'white', armyType: blackArmyType, position: 'f1'},
    {type: 'knight', id: '1', color: 'white', armyType: blackArmyType, position: 'b1'},
    {type: 'knight', id: '2', color: 'white', armyType: blackArmyType, position: 'g1'},
    {type: 'pawn', id: '1', color: 'white', armyType: blackArmyType, position: 'a2'},
    {type: 'pawn', id: '2', color: 'white', armyType: blackArmyType, position: 'b2'},
    {type: 'pawn', id: '3', color: 'white', armyType: blackArmyType, position: 'c2'},
    {type: 'pawn', id: '4', color: 'white', armyType: blackArmyType, position: 'd2'},
    {type: 'pawn', id: '5', color: 'white', armyType: blackArmyType, position: 'e2'},
    {type: 'pawn', id: '6', color: 'white', armyType: blackArmyType, position: 'f2'},
    {type: 'pawn', id: '7', color: 'white', armyType: blackArmyType, position: 'g2'},
    {type: 'pawn', id: '8', color: 'white', armyType: blackArmyType, position: 'h2'},

    {type: 'king', id: '', color: 'black', armyType: whiteArmyType, position: 'e8'},
    {type: 'queen', id: '', color: 'black', armyType: whiteArmyType, position: 'd8'},
    {type: 'rook', id: '1', color: 'black', armyType: whiteArmyType, position: 'a8'},
    {type: 'rook', id: '2', color: 'black', armyType: whiteArmyType, position: 'h8'},
    {type: 'bishop', id: '1', color: 'black', armyType: whiteArmyType, position: 'c8'},
    {type: 'bishop', id: '2', color: 'black', armyType: whiteArmyType, position: 'f8'},
    {type: 'knight', id: '1', color: 'black', armyType: whiteArmyType, position: 'b8'},
    {type: 'knight', id: '2', color: 'black', armyType: whiteArmyType, position: 'g8'},
    {type: 'pawn', id: '1', color: 'black', armyType: whiteArmyType, position: 'a7'},
    {type: 'pawn', id: '2', color: 'black', armyType: whiteArmyType, position: 'b7'},
    {type: 'pawn', id: '3', color: 'black', armyType: whiteArmyType, position: 'c7'},
    {type: 'pawn', id: '4', color: 'black', armyType: whiteArmyType, position: 'd7'},
    {type: 'pawn', id: '5', color: 'black', armyType: whiteArmyType, position: 'e7'},
    {type: 'pawn', id: '6', color: 'black', armyType: whiteArmyType, position: 'f7'},
    {type: 'pawn', id: '7', color: 'black', armyType: whiteArmyType, position: 'g7'},
    {type: 'pawn', id: '8', color: 'black', armyType: whiteArmyType, position: 'h7'}
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
