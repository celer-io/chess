'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')

const add1 = _.add(1)
const coordsOf = _.curry((x, y) => ({x, y}))
const coordsOfX = x => coordsOf(x, _.__)
const coordsOfY = y => coordsOf(_.__, y)

const possiblesOf = coords => _.compose(_.reject(_.isNil), _.map(M.transform(coords)))

const isWhite = _.propEq('color', 'white')
const isBlack = _.propEq('color', 'black')

// TODO: use currided function with _.__ ?
const rangeUp = coord => {
  return _.range(add1(coord), 8)
}
const rangeDown = coord => {
  return _.reverse(_.range(0, coord))
}

const areOponents = _.curry((piece1, piece2) => {
  return (isWhite(piece1) && isBlack(piece2)) || (isWhite(piece2) && isBlack(piece1))
})

const appendInDirection = _.curry((matrix, coords, isOponent, moves, possible) => {
  const piece = M.get(matrix, possible)
  if (!piece) return _.append({origin: coords, update: possible, captures: []}, moves)
  if (isOponent(piece)) return _.reduced(_.append({origin: coords, update: possible, captures: [possible]}, moves))

  return _.reduced(moves)
})

const toDiag = (xs, ys) => {
  if (xs.length > ys.length) {
    xs = _.take(ys.length, xs)
  } else if (ys.length > xs.length) {
    ys = _.take(xs.length, ys)
  }
  return _.times(idx => coordsOf(xs[idx], ys[idx]), xs.length)
}

module.exports = {
  coordsOf,
  possiblesOf,
  rangeUp,
  rangeDown,
  areOponents,
  appendInDirection,
  toDiag,
  coordsOfX,
  coordsOfY
}
