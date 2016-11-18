'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const coordsOf = require('./utils').coordsOf
const possiblesOf = require('./utils').possiblesOf
const areOponents = require('./utils').areOponents

module.exports = (matrix, coords) => {
  const transformations = [
    coordsOf(2, 1),
    coordsOf(2, -1),
    coordsOf(1, 2),
    coordsOf(-1, 2),
    coordsOf(-2, 1),
    coordsOf(-2, -1),
    coordsOf(1, -2),
    coordsOf(-1, -2)
  ]

  const possibles = possiblesOf(coords)(transformations)
  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({origin: coords, update: possible, captures: []}, moves)
    if (isOponent(piece)) return _.append({origin: coords, update: possible, captures: [possible]}, moves)

    return moves
  }

  return _.reduce(appendMove, [], possibles)
}
