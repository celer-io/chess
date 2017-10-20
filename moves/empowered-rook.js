'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')
const possiblesOf = require('./utils').possiblesOf
const coordsOf = require('./utils').coordsOf

const bishopMoves = require('./classic-bishop')
const rookMoves = require('./classic-rook')
const knightMoves = require('./classic-knight')

// TODO: move into utils
const isBishop = _.propEq('type', 'bishop')
// TODO: move into utils
const isKnight = _.propEq('type', 'knight')

module.exports = (matrix, coords) => {
  const piece = M.get(matrix, coords)
  // TODO: move into utils
  const adjacents = [
    coordsOf(1, 0),
    coordsOf(-1, 0),
    coordsOf(0, 1),
    coordsOf(0, -1)
  ]

  // const isEmpoweredBy = (type) => {
  //
  // }

  // TODO: move into utils
  const adjacentPieces = _.compose(_.filter(_.propEq('color', piece.color)), _.reject(_.isNil), _.map(M.get(matrix)), possiblesOf(coords))(adjacents) // to much nil checking ! => use functionale nullable and monads...

  // return _.compose(
  //   trace('whenKnightAdjacent'),
  //   _.when(_.any(isKnight, adjacentPieces), _.concat(knightMoves(matrix, coords))),
  //   trace('whenBishopAdjacent'),
  //   _.when(_.any(isBishop, adjacentPieces), _.concat(bishopMoves(matrix, coords)))
  // )(rookMoves(matrix, coords))

  // TODO: refactor to remove mutation
  let ret = rookMoves(matrix, coords)
  if (_.any(isBishop, adjacentPieces)) ret = _.concat(ret, bishopMoves(matrix, coords))
  if (_.any(isKnight, adjacentPieces)) ret = _.concat(ret, knightMoves(matrix, coords))

  return ret
}
