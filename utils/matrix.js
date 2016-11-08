'use strict'
const _ = require('ramda')

// TODO: memoize ?
const lensX = (coords) => _.lensIndex(_.prop('x', coords))

// TODO: memoize ?
const lensY = (coords) => _.lensIndex(_.prop('y', coords))

// TODO: memoize
const lensCoords = (coords) => _.compose(lensX(coords), lensY(coords))

const get = _.curry((matrix, coords) => _.view(lensCoords(coords), matrix))

const set = _.curry((matrix, coords, piece) => _.set(lensCoords(coords), piece, matrix))

const remove = _.curry((matrix, coords) => _.set(lensCoords(coords), null, matrix))

// const update = _.curry((matrix, origin, destination) => _.compose(remove(_._, origin), set(matrix, destination), get(matrix, origin))())
const update = _.curry((matrix, origin, destination) => {
  return remove(set(matrix, destination, get(matrix, origin)), origin)
})

// const pieceAfterTransform = (matrix, origin, transformation) => {
//   const transformed = transform(origin, transformation)
//   if (!transformed) return null
//
//   return get(matrix, transformed)
// }

// const anyPieceAfterTransform = _.curry((matrix, origin, transformation) => {
//   const piece = pieceAfterTransform(matrix, origin, transformation)
//   if (!piece) return false
//
//   return true
// })

// TODO: memoize ?
// applies relative coords(transformation) to origin coords
const transform = _.curry((origin, transformation) => {
  const transformed = {
    x: origin.x + transformation.x,
    y: origin.y + transformation.y
  }
  if (transformed.x < 0 || transformed.x > 7 || transformed.y < 0 || transformed.y > 7) return null
  return transformed
})

const applyMove = (matrix, move, origin) => {
  const destination = _.prop('update', move)
  const deletes = _.prop('deletes', move)

  return update(_.reduce(remove, matrix, deletes), origin, destination)
}

const letterToY = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }

// TODO: memoize
const coords = (position) => {
  return {
    x: _.subtract(7, _.dec(_.last(position))), // XXX: x = 7 - (number - 1)
    y: _.prop(_.head(position), letterToY)
  }
}

const YtoLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
// TODO: memoize
const position = coords => _.concat(
  _.view(lensY(coords), YtoLetter),
  _.subtract(8, _.prop('x', coords))
)

/*
Iterate over an input matrix, calling a provided function fn for each element in the matrix.
Does not skip unasigned.
fn receives two arguments: (piece, coords).
*/
const forEach = (fn, matrix) => {
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      fn(matrix[x][y], {x, y})
    }
  }
}

/*
Iterate over an input matrix, calling a provided function fn for each element in the matrix.
Does skip unasigned.
fn receives two arguments: (piece, position).
*/
const forEachByPosition = (fn, matrix) => {
  forEach((piece, coords) => {
    if (piece) fn(piece, position(coords))
  }, matrix)
}

const findByColor = _.curry((color, matrix) => {
  return _.compose(_.filter(_.propEq('color', color)), _.reject(_.isNil), _.flatten)(matrix)
})

const findAll = (matrix) => {
  return _.compose(_.reject(_.isNil), _.flatten)(matrix)
}

const findWhites = findByColor('white')
const findBlacks = findByColor('black')

const findByColorIndexed = (matrix, color) => {
  return _.compose(_.filter(_.pathEq(['piece', 'color'], color)), indexByCoords)(matrix)
}

const indexByCoords = (matrix) => {
  let ret = []
  forEach((piece, coords) => {
    if (piece) ret = _.append({coords, piece}, ret)
  }, matrix)
  return ret
}

module.exports = {
  set,
  transform,
  get,
  remove,
  update,
  position,
  coords,
  applyMove,
  findByColor,
  findWhites,
  findBlacks,
  forEachByPosition,
  findAll,
  findByColorIndexed
}
