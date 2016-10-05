'use strict'
const _ = require('ramda')

const coordsLens = (coords) => _.compose(_.lensIndex(_.prop('x', coords)), _.lensIndex(_.prop('y', coords)))

const get = _.curry((matrix, coords) => _.view(coordsLens(coords), matrix))

const set = _.curry((matrix, coords, piece) => _.set(coordsLens(coords), piece, matrix))

const remove = _.curry((matrix, coords) => _.set(coordsLens(coords), null, matrix))

// const remove = (matrix, coords) => {
//   delete matrix[coords.y][coords.x]
//   return matrix
// }

const update = (matrix, origin, destination) => remove(set(matrix, destination, get(matrix, origin)), origin)

// const update = (matrix, origin, destination) => {
//   var piece = getPiece(matrix, origin)
//   matrix = removePiece(matrix, origin)
//   return setPiece(matrix, destination, piece)
// }

const transform = (origin, destination) => {
  const transformed = {
    x: origin.x + destination.x,
    y: origin.y + destination.y
  }
  if (transformed.x < 0 || transformed.x > 7 || transformed.y < 0 && transformed.y > 7) return null
  return transformed
}

// [[a8,b8,c8,d8,e8,f8,g8,h8],
//  [a7,b7,c7,d7,e7,f7,g7,h7],
//  [a6,b6,c6,d6,e6,f6,g6,h6],
//  [a5,b5,c5,d5,e5,f5,g5,h5],
//  [a4,b4,c4,d4,e4,f4,g4,h4],
//  [a3,b3,c3,d3,e3,f3,g3,h3],
//  [a2,b2,c2,d2,e2,f2,g2,h2],
//  [a1,b1,c1,d1,e1,f1,g1,h1]]

const letterToY = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }

const coords = (position) => {
  return {
    x: _.subtract(7, _.dec(_.last(position))),
    y: _.prop(_.head(position), letterToY)
  }
}

const YtoLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']


// _.concat(_.view(_.lensIndex(_.prop('x', coords)), XtoLetter), _.inc(_.prop('y', coords)));

const position = coords => _.concat(_.view(_.lensIndex(_.prop('y', coords)), YtoLetter), _.add(7, _.prop('x', coords)))

module.exports = { set, transform, get, remove, update, position, coords }
