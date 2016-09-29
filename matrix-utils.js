
function getPieceAtPosition (matrix, position, transformation = { x: 0, y: 0 }) {
  const coords = positionToCoords(position)

  return matrix[coords.y + transformation.y][coords.x + transformation.x]
}

function setPieceAt (matrix, position, piece) {
  position = positionToCoords(position)
  matrix[position.y][position.x] = piece
  return matrix
}

// [['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'],
//  ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'],
//  ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'],
//  ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
//  ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
//  ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'],
//  ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'],
//  ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8']]

function positionToCoords (position) {
  const letterToX = { h: 0, g: 1, f: 2, e: 3, d: 4, c: 5, b: 6, a: 7 }
  return {
    x: letterToX[position.split('')[0]],
    y: position.split('')[1] - 1
  }
}

function coordsToPosition (coords) {
  const XtoLetter = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
  return XtoLetter[coords.x] + (coords.y + 1)
}

function getTransformed(position, t){
  const coords = positionToCoords(position)
  const trd = {
    x: coords.x + t.x,
    y: coords.y + t.y
  }
  if (trd.x < 0 || trd.x > 7 || trd.y < 0 && trd.y > 7) return null

  return coordsToPosition(trd)
}

module.exports = {
  getPieceAtPosition,
  setPieceAt,
  getTransformed
}
