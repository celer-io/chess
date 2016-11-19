'ues strict'
// const _ = require('ramda')
const M = require('../utils/matrix')

const coordsOf = require('./utils').coordsOf
const pawnMoves = require('./nemesis-pawn')

module.exports = (matrix, coords) => {
  const sides = [coordsOf(1, 1), coordsOf(1, -1)]
  const front = [coordsOf(1, 0)]
  const kingCoords = M.findKingCoords(matrix, 'white')

  return pawnMoves(matrix, coords, sides, front, kingCoords)
}
