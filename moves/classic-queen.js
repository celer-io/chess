'ues strict'
const _ = require('ramda')

const rookMoves = require('./classic-rook')
const bishopMoves = require('./classic-bishop')

module.exports = (matrix, coords) => _.concat(
  rookMoves(matrix, coords),
  bishopMoves(matrix, coords)
)
