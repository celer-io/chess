'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')
const coordsOfY = require('./utils').coordsOfY
const coordsOfX = require('./utils').coordsOfX
const areOponents = require('./utils').areOponents
const appendInDirection = require('./utils').appendInDirection
const rangeUp = require('./utils').rangeUp
const rangeDown = require('./utils').rangeDown

module.exports = (matrix, coords) => {
  const possiblesXup = _.map(coordsOfY(coords.y), rangeUp(coords.x))
  const possiblesYup = _.map(coordsOfX(coords.x), rangeUp(coords.y))
  const possiblesXdown = _.map(coordsOfY(coords.y), rangeDown(coords.x))
  const possiblesYdown = _.map(coordsOfX(coords.x), rangeDown(coords.y))

  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = appendInDirection(matrix, coords, isOponent)

  return _.compose(
    _.reduce(appendMove, _.__, possiblesXup),
    _.reduce(appendMove, _.__, possiblesYup),
    _.reduce(appendMove, _.__, possiblesXdown),
    _.reduce(appendMove, _.__, possiblesYdown)
  )([])
}
