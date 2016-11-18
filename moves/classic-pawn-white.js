'ues strict'
const coordsOf = require('./utils').coordsOf
const pawnMoves = require('./classic-pawn')

module.exports = (matrix, coords) => {
  const sides = [coordsOf(-1, -1), coordsOf(-1, 1)]
  const front = coords.x === 6
  ? [coordsOf(-1, 0), coordsOf(-2, 0)]
  : [coordsOf(-1, 0)]

  return pawnMoves(matrix, coords, sides, front)
}
