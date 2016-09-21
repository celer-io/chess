'use strict'

class Rules {
  constructor (typeWhiteArmy, typeBlackArmy) {}
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
  getArmies () {
    return [
      {type: 'king', id: '', color: 'white', position: 'e1'},
      {type: 'queen', id: '', color: 'white', position: 'd1'},
      {type: 'rook', id: '1', color: 'white', position: 'a1'},
      {type: 'rook', id: '2', color: 'white', position: 'h1'},
      {type: 'bishop', id: '1', color: 'white', position: 'c1'},
      {type: 'bishop', id: '2', color: 'white', position: 'f1'},
      {type: 'knight', id: '1', color: 'white', position: 'b1'},
      {type: 'knight', id: '2', color: 'white', position: 'g1'},
      {type: 'pawn', id: '1', color: 'white', position: 'a2'},
      {type: 'pawn', id: '2', color: 'white', position: 'b2'},
      {type: 'pawn', id: '3', color: 'white', position: 'c2'},
      {type: 'pawn', id: '4', color: 'white', position: 'd2'},
      {type: 'pawn', id: '5', color: 'white', position: 'e2'},
      {type: 'pawn', id: '6', color: 'white', position: 'f2'},
      {type: 'pawn', id: '7', color: 'white', position: 'g2'},
      {type: 'pawn', id: '8', color: 'white', position: 'h2'},

      {type: 'king', id: '', color: 'black', position: 'e8'},
      {type: 'queen', id: '', color: 'black', position: 'd8'},
      {type: 'rook', id: '1', color: 'black', position: 'a8'},
      {type: 'rook', id: '2', color: 'black', position: 'h8'},
      {type: 'bishop', id: '1', color: 'black', position: 'c8'},
      {type: 'bishop', id: '2', color: 'black', position: 'f8'},
      {type: 'knight', id: '1', color: 'black', position: 'b8'},
      {type: 'knight', id: '2', color: 'black', position: 'g8'},
      {type: 'pawn', id: '1', color: 'black', position: 'a7'},
      {type: 'pawn', id: '2', color: 'black', position: 'b7'},
      {type: 'pawn', id: '3', color: 'black', position: 'c7'},
      {type: 'pawn', id: '4', color: 'black', position: 'd7'},
      {type: 'pawn', id: '5', color: 'black', position: 'e7'},
      {type: 'pawn', id: '6', color: 'black', position: 'f7'},
      {type: 'pawn', id: '7', color: 'black', position: 'g7'},
      {type: 'pawn', id: '8', color: 'black', position: 'h7'}
    ]
  }
}

module.exports = Rules
