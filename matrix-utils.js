class MatrixUtils {
  getPieceAtPosition (matrix, position, transformation = { x: 0, y: 0 }) {
    const letterToX = { h: 0, g: 1, f: 2, e: 3, d: 4, c: 5, b: 6, a: 7 }
    position = {
      x: letterToX[position.split('')[0]],
      y: position.split('')[1] - 1
    }
    return matrix[position.x + transformation.x][position.y + transformation.y]
  }
  setPieceAt (matrix, position, piece) {
    const letterToX = { h: 0, g: 1, f: 2, e: 3, d: 4, c: 5, b: 6, a: 7 }
    position = {
      x: letterToX[position.split('')[0]],
      y: position.split('')[1] - 1
    }
    matrix[position.x][position.y] = piece
  }
}

module.exports = MatrixUtils
