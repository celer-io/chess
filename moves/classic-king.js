'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const possiblesOf = require('./utils').possiblesOf
const areOponents = require('./utils').areOponents
const transformations = require('./utils').kingTransformations

module.exports = (matrix, coords, color) => {
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
