'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const coordsOf = require('./utils').coordsOf
const possiblesOf = require('./utils').possiblesOf
const areOponents = require('./utils').areOponents

module.exports = (matrix, coords, color) => {
  const transformations = [
    coordsOf(0, 1),
    coordsOf(0, -1),
    coordsOf(1, 0),
    coordsOf(-1, 0),
    coordsOf(1, 1),
    coordsOf(-1, -1),
    coordsOf(1, -1),
    coordsOf(-1, 1)
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
