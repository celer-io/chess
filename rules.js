'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')

// const absolute = x => (x > 0) ? x : 0 - x //useless stuff ?

//      y0 y1 y2 y3 y4 y5 y6 y7
// x0 [[a8,b8,c8,d8,e8,f8,g8,h8],
// x1  [a7,b7,c7,d7,e7,f7,g7,h7],
// x2  [a6,b6,c6,d6,e6,f6,g6,h6],
// x3  [a5,b5,c5,d5,e5,f5,g5,h5],
// x4  [a4,b4,c4,d4,e4,f4,g4,h4],
// x5  [a3,b3,c3,d3,e3,f3,g3,h3],
// x6  [a2,b2,c2,d2,e2,f2,g2,h2],
// x7  [a1,b1,c1,d1,e1,f1,g1,h1]]
const add1 = _.add(1)
const coordsOf = _.curry((x, y) => ({x, y}))
const coordsOfX = x => coordsOf(x, _.__)
const coordsOfY = y => coordsOf(_.__, y)

const possiblesOf = coords => _.compose(_.reject(_.isNil), _.map(M.transform(coords)))

const getSlug = piece => piece.color + piece.type + piece.id
const isWhite = _.propEq('color', 'white')
const isBlack = _.propEq('color', 'black')

const areOponents = _.curry((origin, piece) => {
  return (isWhite(origin) && isBlack(piece)) || (isWhite(piece) && isBlack(origin))
})

const whitePawnMoves = (matrix, coords) => {
  // const sideMoves = _.filter(M.anyPieceAfterTransform(matrix, coords), [{x:-1, y:-1}, {x:-1, y:1}])
  //
  // let moves = [{
  //   update: {x: -1, y: 0},
  //   deletes: []
  // }]
  //
  // //TODO : Implement enpassant
  // moves = _.append(_.map(move => ({
  //   update: move,
  //   deletes: [move]
  // }), sideMoves), moves)
  //
  // // TODO: get rid of mutation with lensMoves
  // if (coords.x === 6) {
  //   moves = _.append({
  //     update: {x: -2, y: 0},
  //     deletes: []
  //   }, moves)
  //
  //   moves = _.flatten(moves)
  // }
  //
  // // TODO: ... !!!!!
  // return _.reject(_.isNil, _.map(M.transformMove(coords), moves))
}

const knightMoves = (matrix, coords) => {
  const possibles = possiblesOf(coords)([
    {x: 2, y: 1},
    {x: 2, y: -1},
    {x: 1, y: 2},
    {x: -1, y: 2},
    {x: -2, y: 1},
    {x: -2, y: -1},
    {x: 1, y: -2},
    {x: -1, y: -2}
  ])

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
  const possiblesXup = _.map(coordsOfY(coords.y), _.range(add1(coords.x), 8))
  const possiblesYup = _.map(coordsOfX(coords.x), _.range(add1(coords.y), 8))
  const possiblesXdown = _.map(coordsOfY(coords.y), _.reverse(_.range(0, coords.x)))
  const possiblesYdown = _.map(coordsOfX(coords.x), _.reverse(_.range(0, coords.y)))

  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({update: possible, deletes: []}, moves)
    if (isOponent(piece)) return _.reduced(_.append({ update: possible, deletes: [possible] }, moves))

    return _.reduced(moves)
  }

  return _.compose(
    _.reduce(appendMove, _.__, possiblesXup),
    _.reduce(appendMove, _.__, possiblesYup),
    _.reduce(appendMove, _.__, possiblesXdown),
    _.reduce(appendMove, _.__, possiblesYdown)
  )([])
}
//
// const bishopMoves = _.flatten([
//   _.times((n) => ({y: 1+n, x: 1+n}), 7),
//   _.times((n) => ({y: -1-n, x: -1-n}), 7),
//   _.times((n) => ({y: 1+n, x: -1-n}), 7),
//   _.times((n) => ({y: -1-n, x: 1+n}), 7)
// ])
//
// const queenMoves = _.flatten([rookMoves, bishopMoves])

const armyMoves = {
  classic: {
    white: {
      pawn: whitePawnMoves,
      knight: knightMoves,
      rook: rookMoves
      // bishop: bishopMoves,
      // queen: queenMoves
    },
    black: {

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
  const update = _.prop('update', move)
  const deletes = _.prop('deletes', move)

  console.log('update :', update)
  console.log('M.position(update) :', M.position(update))

  return {
    orgin: origin,
    animation: null,
    update: {
      position: M.position(update),
      slug: slugAt(matrix, origin)
    },
    deletes: _.unless(_.isEmpty, _.map(slugAt(matrix)))(deletes),
    newMatrix: M.applyMove(matrix, move, origin)
  }
})

const getMoveInstructions = (matrix, originPosition, target) => {
  const origin = M.coords(originPosition)
  const destination = M.coords(target)
  const piece = M.get(matrix, origin)
  const moves = movesOf(piece)(matrix, origin)
  // TODO: change _.prop('update') to someting more appropriate when possible move will not (only) be defined by update
  const move = _.find(_.propEq('update', destination), moves)
  console.log('move :', move)

  if (!move) return { error: 'no-can-move' }
  return toInstructions(matrix, origin, move)
}

const getPossibleMoves = (matrix, originPosition) => {
  const origin = M.coords(originPosition)
  const piece = M.get(matrix, origin)
  const moves = movesOf(piece)(matrix, origin)
  console.log('moves :', moves)
  return _.map(toInstructions(matrix, origin), moves)
}

module.exports = {
  getMoveInstructions,
  getPossibleMoves
}
