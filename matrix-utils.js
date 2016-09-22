function getPieceAtPosition (matrix, position, transformation = { x: 0, y: 0 }) {
  position = positionToCoords(position)
  return matrix[position.x + transformation.x][position.y + transformation.y]
}

function setPieceAt (matrix, position, piece) {
  position = positionToCoords(position)
  matrix[position.x][position.y] = piece
  console.log(matrix);
  return matrix
}

function positionToCoords (position) {
  const letterToX = { h: 0, g: 1, f: 2, e: 3, d: 4, c: 5, b: 6, a: 7 }
  return {
    x: letterToX[position.split('')[0]],
    y: position.split('')[1] - 1
  }
}

module.exports = {
  getPieceAtPosition,
  setPieceAt
}