'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const possiblesOf = require('./utils').possiblesOf
const coordsOf = require('./utils').coordsOf
const areOponents = require('./utils').areOponents

const sides = (color) => {
  if (color === 'white') return [coordsOf(-1, -1), coordsOf(-1, 1)]
  else return [coordsOf(1, 1), coordsOf(1, -1)]
}

const front = (color, x) => {
  if (color === 'white') return x === 6 ? [coordsOf(-1, 0), coordsOf(-2, 0)] : [coordsOf(-1, 0)]
  else return x === 1 ? [coordsOf(1, 0), coordsOf(2, 0)] : [coordsOf(1, 0)]
}

// TODO: Handle en passant and elevation...
module.exports = (matrix, coords) => {
  const piece = M.get(matrix, coords)
  const possiblesSides = possiblesOf(coords)(sides(piece.color))
  const possiblesFront = possiblesOf(coords)(front(piece.color, coords.x))

  const isOponent = areOponents(piece)

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
