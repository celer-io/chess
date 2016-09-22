'use strict'
const Board = require('./board.js')
const Rules = require('./rules.js')
const _ = require('ramda')
const M = require('./matrix-utils.js')

document.addEventListener('DOMContentLoaded', () => {
  const rules = new Rules()
  const board = new Board()
  const handlers = {
    squareDragEnter: (ev) => {
      ev.target.classList.add('move-target')
    },
    squareDragOver: (ev) => {
      ev.preventDefault()
    },
    squareDragLeave: (ev) => {
      ev.target.classList.remove('move-target')
    },
    pieceDragEnter: (ev) => {
      ev.target.parentNode.classList.add('move-target')
    },
    pieceDragLeave: (ev) => {
      ev.target.parentNode.classList.remove('move-target')
    },
    squareDrop: (ev) => {
      ev.preventDefault()
      const data = JSON.parse(ev.dataTransfer.getData('text/plain'))
      let squareEl = ev.target
      let pieceEl
      if (squareEl.classList.contains('piece')) {
        squareEl = ev.target.parentNode
        pieceEl = ev.target
      }

      if (data.possibleMoves.indexOf(squareEl.id) === -1) {
        console.log('not availableTargets')
        return
      }

      const newPieceEl = document.getElementById(data.id)
      if (pieceEl) pieceEl.remove()
      squareEl.appendChild(newPieceEl)
    },
    pieceDragStart: (ev) => {
      let data = {
        id: ev.currentTarget.id
      }
      console.log(board)
      board.clearLastMove()

      data.possibleMoves = rules.getMovesFor(gameMatrix, data.id)
      ev.dataTransfer.setData('text/plain', JSON.stringify(data))

      ev.currentTarget.parentNode.classList.add('move-source')

    // TODO: for nice drag and drop in chrome
    // event.dataTransfer.setDragImage(image, xOffset, yOffset)
    }

  }

  // let whiteArmy = getWhiteArmy()
  // let blackArmy = getBlackArmy()

  let gameMatrix = initGame()
  console.log('gameMatrix', gameMatrix);

  //  temporary, we have to model the board as a matrix
  ;[blackArmy, whiteArmy].forEach((army) => {
    Object.values(army).forEach((piece) => {
      board.drawPiece(piece.position, board.createPiece(piece.color, piece.type, piece.id))
    })
  })

  whiteArmy.map((piece) => {
    return piece.position
  }).map((position) => {
    return board.setPieceDraggable(position)
  }).map((piece) => {
    piece.addEventListener('dragstart', handlers.pieceDragStart, false)
  })

  board.getSquares().forEach((square) => {
    square.addEventListener('dragover', handlers.squareDragOver, false)
    square.addEventListener('dragenter', handlers.squareDragEnter, false)
    square.addEventListener('dragleave', handlers.squareDragLeave, false)
    square.addEventListener('drop', handlers.squareDrop, false)
  })

  window.setTimeout(function () {
    board.movePiece('a2', 'a4')
    var m = new M()
    var wesd = m.getPieceAtPosition('truc', 'a4')
    console.log(wesd)
  }, 2000)
})



function initGame () {
  let matrix = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
  ]

  let initialSet = [
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
  initialSet.forEach(piece => {
    matrix = M.setPieceAt(matrix, piece.position, piece)
  })
  return matrix
}
