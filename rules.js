'use strict'

class Rules {
  getMovesFor (gameMatrix, position) {
    console.log('gameMatrix', gameMatrix)
    console.log('position', position)
    return [
      'a3',
      'b3',
      'c3',
      'd3',
      'e3',
      'f3',
      'g3',
      'h3'
    ]
  }
}

module.exports.Rule