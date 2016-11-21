'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const coordsOf = require('./utils').coordsOf
const possiblesOf = require('./utils').possiblesOf
const areOponents = require('./utils').areOponents
const transformations = require('./utils').kingTransformations

const sides = (color) => {
  if (color === 'white') return [coordsOf(-1, -1), coordsOf(-1, 1)]
  else return [coordsOf(1, 1), coordsOf(1, -1)]
}

const front = (color, x) => {
  if (color === 'white') return [coordsOf(-1, 0)]
  else return [coordsOf(1, 0)]
}

const oponentColor = (color) => color === 'white' ? 'black' : 'white'

// TODO: Handle en passant and elevation...
module.exports = (matrix, coords) => {
  const piece = M.get(matrix, coords)
  const possiblesSides = possiblesOf(coords)(sides(piece.color))
  const possiblesFront = possiblesOf(coords)(front(piece.color, coords.x))
  const kingCoords = M.findKingCoords(matrix, oponentColor(piece.color))
  const possiblesNemesis = possiblesOf(coords)(transformations)

  const isOponent = areOponents(piece)

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
