'ues strict'
const _ = require('ramda')
const M = require('../utils/matrix')
const areOponents = require('./utils').areOponents

//      y0 y1 y2 y3 y4 y5 y6 y7
// x0 [[a8,b8,c8,d8,e8,f8,g8,h8],
// x1  [a7,b7,c7,d7,e7,f7,g7,h7],
// x2  [a6,b6,c6,d6,e6,f6,g6,h6],
// x3  [a5,b5,c5,d5,e5,f5,g5,h5],
// x4  [a4,b4,c4,d4,e4,f4,g4,h4],
// x5  [a3,b3,c3,d3,e3,f3,g3,h3],
// x6  [a2,b2,c2,d2,e2,f2,g2,h2],
// x7  [a1,b1,c1,d1,e1,f1,g1,h1]]

module.exports = (matrix, coords) => {
  const piece = M.get(matrix, coords)
  const possibles = _.flatten(_.times(x => {
    // TODO: ...
    if (piece.color === 'white') return _.times(y => ({x: x + 1, y}), 8)
    return _.times(y => ({x, y}), 8)
  }, 7))

  const isOponent = areOponents(M.get(matrix, coords))

  const appendMove = (moves, possible) => {
    const piece = M.get(matrix, possible)
    if (!piece) return _.append({origin: coords, update: possible, captures: []}, moves)
    if (isOponent(piece) && piece.type !== 'king') return _.append({origin: coords, update: possible, captures: [possible]}, moves)

    return moves
  }

  return _.reduce(appendMove, [], possibles)
}
