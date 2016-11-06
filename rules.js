'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')

const trace = _.curry((tag, x) => {
  console.log(tag, x)
  return x
})

// const emptyMatrix = [ // TODO: codegolf !
//   new Array(8),
//   new Array(8),
//   new Array(8),
//   new Array(8),
//   new Array(8),
//   new Array(8),
//   new Array(8),
//   new Array(8)
// ]

const add1 = _.add(1)
const coordsOf = _.curry((x, y) => ({x, y}))
const coordsOfX = x => coordsOf(x, _.__)
const coordsOfY = y => coordsOf(_.__, y)

const possiblesOf = coords => _.compose(_.reject(_.isNil), _.map(M.transform(coords)))

const getSlug = piece => piece.color + piece.type + piece.id
const isWhite = _.propEq('color', 'white')
const isBlack = _.propEq('color', 'black')

// TODO: use currided function with _.__ ?
const rangeUp = coord => {
  return _.range(add1(coord), 8)
}
const rangeDown = coord => {
  return _.reverse(_.range(0, coord))
}

const areOponents = _.curry((origin, piece) => {
  return (isWhite(origin) && isBlack(piece)) || (isWhite(piece) && isBlack(origin))
})

const appendInDirection = _.curry((matrix, isOponent, moves, possible) => {
  const piece = M.get(matrix, possible)
  if (!piece) return _.append({update: possible, deletes: []}, moves)
  if (isOponent(piece)) return _.reduced(_.append({ update: possible, deletes: [possible] }, moves))

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

// TODO: Handle en passant and elevation...
const whitePawnMoves = (matrix, coords) => {
  const sides = [coordsOf(-1, -1), coordsOf(-1, 1)]
  const front = coords.x === 6
  ? [coordsOf(-1, 0), coordsOf(-2, 0)]
  : [coordsOf(-1, 0)]

  return pawnMoves(matrix, coords, sides, front)
}

const blackPawnMoves = (matrix, coords) => {
  const sides = [coordsOf(1, 1), coordsOf(1, -1)]
  const front = coords.x === 1
  ? [coordsOf(1, 0), coordsOf(2, 0)]
  : [coordsOf(1, 0)]

  return pawnMoves(matrix, coords, sides, front)
}

const pawnMoves = (matrix, coords, sides, front) => {
  const possiblesSides = possiblesOf(coords)(sides)
  const possiblesFront = possiblesOf(coords)(front)

  const isOponent = areOponents(M.get(matrix, coords))

  const appendSide = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (piece && isOponent(piece)) return _.append({update: possible, deletes: [possible]}, moves)

    return moves
  }
  const appendFront = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({update: possible, deletes: []}, moves)

    return _.reduced(moves)
  }

  return _.compose(
    _.reduce(appendSide, _.__, possiblesSides),
    _.reduce(appendFront, _.__, possiblesFront)
  )([])
}

const knightMoves = (matrix, coords) => {
  const transformations = [
    coordsOf(2, 1),
    coordsOf(2, -1),
    coordsOf(1, 2),
    coordsOf(-1, 2),
    coordsOf(-2, 1),
    coordsOf(-2, -1),
    coordsOf(1, -2),
    coordsOf(-1, -2)
  ]

  const possibles = possiblesOf(coords)(transformations)
  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({update: possible, deletes: []}, moves)
    if (isOponent(piece)) return _.append({update: possible, deletes: [possible]}, moves)

    return moves
  }

  return _.reduce(appendMove, [], possibles)
}

const rookMoves = (matrix, coords) => {
  const possiblesXup = _.map(coordsOfY(coords.y), rangeUp(coords.x))
  const possiblesYup = _.map(coordsOfX(coords.x), rangeUp(coords.y))
  const possiblesXdown = _.map(coordsOfY(coords.y), rangeDown(coords.x))
  const possiblesYdown = _.map(coordsOfX(coords.x), rangeDown(coords.y))

  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = appendInDirection(matrix, isOponent)

  return _.compose(
    _.reduce(appendMove, _.__, possiblesXup),
    _.reduce(appendMove, _.__, possiblesYup),
    _.reduce(appendMove, _.__, possiblesXdown),
    _.reduce(appendMove, _.__, possiblesYdown)
  )([])
}

const bishopMoves = (matrix, coords) => {
  const possiblesXYUp = toDiag(rangeUp(coords.x), rangeUp(coords.y))
  const possiblesXYDown = toDiag(rangeDown(coords.x), rangeDown(coords.y))
  const possiblesXDownYUp = toDiag(rangeDown(coords.x), rangeUp(coords.y))
  const possiblesXUpYDown = toDiag(rangeUp(coords.x), rangeDown(coords.y))

  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = appendInDirection(matrix, isOponent)

  return _.compose(
    _.reduce(appendMove, _.__, possiblesXYUp),
    _.reduce(appendMove, _.__, possiblesXYDown),
    _.reduce(appendMove, _.__, possiblesXDownYUp),
    _.reduce(appendMove, _.__, possiblesXUpYDown)
  )([])
}

const queenMoves = (matrix, coords) => _.concat(
  rookMoves(matrix, coords),
  bishopMoves(matrix, coords)
)

//      y0 y1 y2 y3 y4 y5 y6 y7
// x0 [[a8,b8,c8,d8,e8,f8,g8,h8],
// x1  [a7,b7,c7,d7,e7,f7,g7,h7],
// x2  [a6,b6,c6,d6,e6,f6,g6,h6],
// x3  [a5,b5,c5,d5,e5,f5,g5,h5],
// x4  [a4,b4,c4,d4,e4,f4,g4,h4],
// x5  [a3,b3,c3,d3,e3,f3,g3,h3],
// x6  [a2,b2,c2,d2,e2,f2,g2,h2],
// x7  [a1,b1,c1,d1,e1,f1,g1,h1]]

const concatDeletes = (deletes, piece) => {
  // return _.concat(_.reject(_.isEmpty, _.map(_.prop('deletes'), movesOf(piece))), deletes)
  console.warn('FIXME !')
  // return _.compose(_.concat(deletes), trace('reject empty'), _.reject(_.isEmpty), trace('mapPropDelete'), _.map(_.prop('deletes')), trace('movesOf'), movesOf)(piece)
  return _.compose(_.concat(deletes), _.reject(_.isEmpty), _.map(_.prop('deletes')), movesOf)(piece)
}

const kingMoves = (matrix, coords, oponentColor) => {
  const oponentPieces = M.findByColor(oponentColor, matrix)
  const oponentDeletes = _.reduce(concatDeletes, [], oponentPieces)

  const transformations = [
    coordsOf(0, 1),
    coordsOf(0, -1),
    coordsOf(1, 0),
    coordsOf(-1, 0),
    coordsOf(1, 1),
    coordsOf(-1, -1),
    coordsOf(1, -1),
    coordsOf(-1, 1)
  ]

  const possibles = possiblesOf(coords)(transformations)
  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = (moves, possible) => {
    if (_.any(_.equals(possible), oponentDeletes)) return moves

    const piece = M.get(matrix, possible)
    if (!piece) return _.append({update: possible, deletes: []}, moves)
    if (isOponent(piece)) return _.append({update: possible, deletes: [possible]}, moves)

    return moves
  }

  return _.reduce(appendMove, [], possibles)
}

const whiteKingMoves = (matrix, coords) => {
  return kingMoves(matrix, coords, 'black')
}

const blackKingMoves = (matrix, coords, color) => {
  return kingMoves(matrix, coords, 'white')
}

const armyMoves = {
  classic: {
    white: {
      pawn: whitePawnMoves,
      knight: knightMoves,
      rook: rookMoves,
      bishop: bishopMoves,
      queen: queenMoves,
      king: whiteKingMoves
    },
    black: {
      pawn: blackPawnMoves,
      knight: knightMoves,
      rook: rookMoves,
      bishop: bishopMoves,
      queen: queenMoves,
      king: blackKingMoves
    }
  }
}

const movesOf = (piece) => {
  return armyMoves[piece.armyType][piece.color][piece.type]
  // return _.path([piece.armyType, piece.color, piece.type])(armyMoves)
}

const toInstructions = _.curry((matrix, origin, move) => {
  const slugAt = _.curry((matrix, coords) => getSlug(M.get(matrix, coords)))
  // TODO: replace with lenses ? meh...
  const update = _.prop('update', move) // TODO: clean code with equational reasoning
  const deletes = _.prop('deletes', move)

  return {
    orgin: origin,
    animation: null,
    update: {
      position: M.position(update),
      coords: update,
      slug: slugAt(matrix, origin)
    },
    deletes: _.unless(_.isEmpty, _.map(slugAt(matrix)))(deletes),
    matrix: M.applyMove(matrix, move, origin) // calculation of new state ?
  }
})

const getMoveInstructions = (matrix, originPosition, target) => {
  const origin = M.coords(originPosition)
  const destination = M.coords(target)
  const piece = M.get(matrix, origin)
  const moves = movesOf(piece)(matrix, origin)
  // TODO: change _.prop('update') to someting more appropriate when possible move will not (only) be defined by update
  const move = _.find(_.propEq('update', destination), moves)

  if (!move) return { error: 'no-can-move' }
  return toInstructions(matrix, origin, move)
}

const getPossibleMoves = (matrix, originPosition) => {
  const origin = M.coords(originPosition)
  const piece = M.get(matrix, origin)
  const moves = movesOf(piece)(matrix, origin)
  return _.map(toInstructions(matrix, origin), moves)
}

module.exports = {
  getMoveInstructions,
  getPossibleMoves
}
