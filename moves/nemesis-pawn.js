'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const possiblesOf = require('./utils').possiblesOf
const areOponents = require('./utils').areOponents
const transformations = require('./utils').kingTransformations

// TODO: Handle en passant and elevation...
module.exports = (matrix, coords, sides, front, kingCoords) => {
  const possiblesSides = possiblesOf(coords)(sides)
  const possiblesFront = possiblesOf(coords)(front)
  const possiblesNemesis = possiblesOf(coords)(transformations)

  const isOponent = areOponents(M.get(matrix, coords))

  const appendSide = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (piece && isOponent(piece)) return _.append({origin: coords, update: possible, captures: [possible]}, moves)

    return moves
  }

  const appendFront = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({origin: coords, update: possible, captures: []}, moves)

    return moves
  }

  const appendNemesis = (moves, possible) => {
    if (possible.y > kingCoords.y && possible.y > coords.y ||
        possible.y < kingCoords.y && possible.y < coords.y ||
        possible.x > kingCoords.x && possible.x > coords.x ||
        possible.x < kingCoords.x && possible.x < coords.x) return moves

    const piece = M.get(matrix, possible)
    if (!piece) return _.append({origin: coords, update: possible, captures: []}, moves)

    return moves
  }

  return _.compose(
    _.uniqBy(_.prop('update')),
    _.reduce(appendNemesis, _.__, possiblesNemesis),
    _.reduce(appendFront, _.__, possiblesFront),
    _.reduce(appendSide, _.__, possiblesSides)
  )([])
}
