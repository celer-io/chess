'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')
const possiblesOf = require('./utils').possiblesOf
const coordsOf = require('./utils').coordsOf

const bishopMoves = require('./classic-bishop')
const rookMoves = require('./classic-rook')
const knightMoves = require('./classic-knight')

module.exports = (matrix, coords) => {
  const piece = M.get(matrix, coords)
  const adjacents = [
    coordsOf(1, 0),
    coordsOf(-1, 0),
    coordsOf(0, 1),
    coordsOf(0, -1)
  ]

  const adjacentPieces = _.compose(_.filter(_.propEq('color', piece.color)), _.reject(_.isNil), _.map(M.get(matrix)), possiblesOf(coords))(adjacents)

  // TODO: refactor to remove mutation
  let ret = knightMoves(matrix, coords)
  if (_.any(_.propEq('type', 'bishop'), adjacentPieces)) ret = _.concat(ret, bishopMoves(matrix, coords))
  if (_.any(_.propEq('type', 'rook'), adjacentPieces)) ret = _.concat(ret, rookMoves(matrix, coords))

  return ret
}
