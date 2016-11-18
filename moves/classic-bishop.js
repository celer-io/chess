'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const toDiag = require('./utils').toDiag
const areOponents = require('./utils').areOponents
const appendInDirection = require('./utils').appendInDirection
const rangeUp = require('./utils').rangeUp
const rangeDown = require('./utils').rangeDown

module.exports = (matrix, coords) => {
  const possiblesXYUp = toDiag(rangeUp(coords.x), rangeUp(coords.y))
  const possiblesXYDown = toDiag(rangeDown(coords.x), rangeDown(coords.y))
  const possiblesXDownYUp = toDiag(rangeDown(coords.x), rangeUp(coords.y))
  const possiblesXUpYDown = toDiag(rangeUp(coords.x), rangeDown(coords.y))

  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = appendInDirection(matrix, coords, isOponent)

  return _.compose(
    _.reduce(appendMove, _.__, possiblesXYUp),
    _.reduce(appendMove, _.__, possiblesXYDown),
    _.reduce(appendMove, _.__, possiblesXDownYUp),
    _.reduce(appendMove, _.__, possiblesXUpYDown)
  )([])
}
