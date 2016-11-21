'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const queenMoves = require('./classic-queen')

module.exports = (matrix, coords) => _.filter(move => {
  if (move.captures.length === 0) return true
  const piece = M.get(matrix, move.captures[0])
  return piece.type === 'king'
}, queenMoves(matrix, coords))
