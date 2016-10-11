'use strict'
const _ = require('ramda')

const lensX = (coords) => _.lensIndex(_.prop('x', coords))

const lensY = (coords) => _.lensIndex(_.prop('y', coords))

const lensCoords = (coords) => _.compose(lensX(coords), lensY(coords))

const get = _.curry((matrix, coords) => _.view(lensCoords(coords), matrix))

const set = _.curry((matrix, coords, piece) => _.set(lensCoords(coords), piece, matrix))

const remove = _.curry((matrix, coords) => _.set(lensCoords(coords), null, matrix))

const update = (matrix, origin, destination) => {
  return remove(set(matrix, destination, get(matrix, origin)), origin)
}

const pieceAfterTransform = (matrix, origin, transformation) => {
  const transformed = transform(origin, transformation)
  if (!transformed) return null

  return get(matrix, transformed)
}

const anyPieceAfterTransform = _.curry((matrix, origin, transformation) => {
  const piece = pieceAfterTransform(matrix, origin, transformation)
  if (!piece) return false

  return true
})

//applies relative coords(transformation) to origin coords
const transform = _.curry((origin, transformation) => {
  const transformed = {
    x: origin.x + transformation.x,
    y: origin.y + transformation.y
  }
  if (transformed.x < 0 || transformed.x > 7 || transformed.y < 0 && transformed.y > 7) return null
  return transformed
})

const applyMove = (matrix, move, origin) => {
  const destination = _.prop('update', move)
  const deletes = _.prop('deletes', move)

  return update(_.reduce(remove, matrix, deletes), origin, destination)
}

const transformMove = _.curry((origin, move) => {
  if (!transform(origin, move.update)) return null

  return {
    update: transform(origin, move.update),
    deletes: _.map(transform(origin), move.deletes)
  };
})

const letterToY = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }

const coords = (position) => {
  return {
    x: _.subtract(7, _.dec(_.last(position))), // XXX: x = 7 - (number - 1)
    y: _.prop(_.head(position), letterToY)
  }
}

const YtoLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const position = coords => _.concat(
  _.view(lensY(coords), YtoLetter),
  _.subtract(8, _.prop('x', coords))
)

module.exports = {
  set,
  transform,
  get,
  remove,
  update,
  position,
  coords,
  anyPieceAfterTransform,
  transformMove,
  applyMove
}
