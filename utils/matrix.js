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

const applyMove = _.curry((matrix, move) => {
  const destination = _.prop('update', move)
  const captures = _.prop('captures', move)
  const origin = _.prop('origin', move)

  return update(_.reduce(remove, matrix, captures), origin, destination)
})

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

const findByColorIndexed = _.curry((matrix, color) => {
  return _.compose(_.filter(_.pathEq(['piece', 'color'], color)), indexByCoords)(matrix)
})

// TODO: memoize
const indexByCoords = (matrix) => {
  let ret = []
  forEach((piece, coords) => {
    if (piece) ret = _.append({coords, piece}, ret)
  }, matrix)
  return ret
}

const isKing = _.curry((color, pieceIndexed) => _.whereEq({ type: 'king', color }, _.prop('piece', pieceIndexed)))

// const trace = _.curry((tag, x) => {
//   console.log(tag, x)
//   return x
// })

const findKingCoords = (matrix, color) => _.compose(
  _.prop('coords'),
  _.find(isKing(color)),
  indexByCoords
)(matrix)

// 8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// 7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
// 6 … … … … … … … …
// 5 … … … … … … … …
// 4 … … … … … … … …
// 3 … … ♘ … … … … …
// 2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
// 1 ♖ … ♗ ♕ ♔ ♗ ♘ ♖
//   a b c d e f g h

const toUnicode = piece => {
  return unicodeChess[piece.color][piece.type]
}

const unicodeChess = {
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  },
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  }
}

const trace = _.curry((tag, matrix) => {
  let unicodeBoard = ''
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      let piece = matrix[x][y]

      if (piece) unicodeBoard += toUnicode(piece) + ' '
      else unicodeBoard += '  '

      if (y === matrix[x].length - 1) unicodeBoard += '\n'
    }
  }
  console.log(tag + '\n', unicodeBoard)
  return matrix
})

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
  findByColorIndexed,
  findKingCoords,
  trace
}
