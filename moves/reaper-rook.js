'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

module.exports = (matrix, coords) => _.map(s => ({origin: coords, update: s, captures: []}), M.findOpenSquares(matrix))
