'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const possiblesOf = require('./utils').possiblesOf
const areOponents = require('./utils').areOponents

// TODO: Handle en passant and elevation...
module.exports = (matrix, coords, sides, front) => {
  const possiblesSides = possiblesOf(coords)(sides)
  const possiblesFront = possiblesOf(coords)(front)

  const isOponent = areOponents(M.get(matrix, coords))

  const appendSide = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (piece && isOponent(piece)) return _.append({origin: coords, update: possible, captures: [possible]}, moves)

    return moves
  }
  const appendFront = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({origin: coords, update: possible, captures: []}, moves)

    return _.reduced(moves)
  }

  return _.compose(
    _.reduce(appendSide, _.__, possiblesSides),
    _.reduce(appendFront, _.__, possiblesFront)
  )([])
}
