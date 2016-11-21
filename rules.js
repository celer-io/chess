'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')

// const trace = _.curry((tag, x) => {
//   console.log(tag, x)
//   return x
// })

//      y0 y1 y2 y3 y4 y5 y6 y7
// x0 [[a8,b8,c8,d8,e8,f8,g8,h8],
// x1  [a7,b7,c7,d7,e7,f7,g7,h7],
// x2  [a6,b6,c6,d6,e6,f6,g6,h6],
// x3  [a5,b5,c5,d5,e5,f5,g5,h5],
// x4  [a4,b4,c4,d4,e4,f4,g4,h4],
// x5  [a3,b3,c3,d3,e3,f3,g3,h3],
// x6  [a2,b2,c2,d2,e2,f2,g2,h2],
// x7  [a1,b1,c1,d1,e1,f1,g1,h1]]

const armyMoves = {
  classic: {
    white: {
      pawn: require('./moves/classic-pawn-white'),
      knight: require('./moves/classic-knight'),
      rook: require('./moves/classic-rook'),
      bishop: require('./moves/classic-bishop'),
      queen: require('./moves/classic-queen'),
      king: require('./moves/classic-king')
    },
    black: {
      pawn: require('./moves/classic-pawn-black'),
      knight: require('./moves/classic-knight'),
      rook: require('./moves/classic-rook'),
      bishop: require('./moves/classic-bishop'),
      queen: require('./moves/classic-queen'),
      king: require('./moves/classic-king')
    }
  },
  nemesis: {
    white: {
      pawn: require('./moves/nemesis-pawn-white'),
      knight: require('./moves/classic-knight'),
      rook: require('./moves/classic-rook'),
      bishop: require('./moves/classic-bishop'),
      queen: require('./moves/nemesis-queen'),
      king: require('./moves/classic-king')
    },
    black: {
      pawn: require('./moves/nemesis-pawn-black'),
      knight: require('./moves/classic-knight'),
      rook: require('./moves/classic-rook'),
      bishop: require('./moves/classic-bishop'),
      queen: require('./moves/nemesis-queen'),
      king: require('./moves/classic-king')
    }
  }
}

const concatCaptures = _.curry((matrix, captures, pieceIndexed) => {
  const moves = movesOf(matrix, pieceIndexed.piece, pieceIndexed.coords, false)
  return _.compose(
    _.concat(captures),
    _.flatten,
    _.map(_.prop('captures'))
  )(moves)
})

const oponentColor = (color) => color === 'white' ? 'black' : 'white'

const isInCheck = _.curry((matrix, color) => {
  const oponentPieces = M.findByColorIndexed(matrix, oponentColor(color))
  const kingCoords = M.findKingCoords(matrix, color)
  const oponentCaptures = _.reduce(concatCaptures(matrix), [], oponentPieces)
  return _.any(_.equals(kingCoords), oponentCaptures)
})

const movesOf = (matrix, piece, coords, recurse = true) => {
  const moves = _.reject(move => {
    return _.any(capture => {
      const capturePiece = M.get(matrix, capture)
      return piece.type !== 'king' && capturePiece.armyType === 'nemesis' && capturePiece.type === 'queen'
    }, move.captures)
    // TODO: also remove moves that captures a nemesis-queen... and or reaper-rook or animals-rook...
  }, armyMoves[piece.armyType][piece.color][piece.type](matrix, coords))

  if (!recurse) return moves

  return _.reject(move => {
    const possibleMatrix = M.applyMove(matrix, move, coords)
    return isInCheck(possibleMatrix, piece.color)
  }, moves)
}

const getSlug = piece => piece.color + piece.type + piece.id
const slugAt = _.curry((matrix, coords) => getSlug(M.get(matrix, coords)))

const toInstructions = _.curry((matrix, move) => {
  const update = _.prop('update', move)
  const captures = _.prop('captures', move)

  return {
    orgin: move.origin,
    animation: null,
    update: {
      position: M.position(update),
      coords: update,
      slug: slugAt(matrix, move.origin)
    },
    captures: _.unless(_.isEmpty, _.map(slugAt(matrix)))(captures),
    matrix: M.applyMove(matrix, move)
  }
})

const getMoveInstructions = (game, source, target) => {
  const origin = M.coords(source)
  const destination = M.coords(target)
  const move = _.find(m => {
    return _.equals(origin, m.origin) && _.equals(destination, m.update)
  }, game.possibleMoves)

  if (!move) return { error: 'no-can-move' }
  return toInstructions(game.matrix, move)
}

const getPossibleMoves = (matrix, color) => _.compose(_.reject(m => _.isEmpty(m.coords)), _.flatten, _.map(p => movesOf(matrix, p.piece, p.coords)), M.findByColorIndexed(matrix))(color)

const isMidlineInvasion = (matrix, color) => {
  const kingCoords = M.findKingCoords(matrix, color)
  return color === 'white' && kingCoords.x < 4 || color === 'black' && kingCoords.x > 3
}

module.exports = {
  getMoveInstructions,
  getPossibleMoves,
  oponentColor,
  isInCheck,
  isMidlineInvasion
}
