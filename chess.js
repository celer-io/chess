// const R = require('ramda')
function main () {
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

  let whiteArmy = getWhiteArmy()
  let blackArmy = getBlackArmy()

  let gameMatrix = initGame()

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
}

class M {
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

function initGame () {
  let matrix = [
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'],
    ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'],
    ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'],
    ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
    ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
    ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'],
    ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'],
    ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8']
  ]
  //TODO : build matrix from armies
  return matrix
}

function getWhiteArmy () {
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
    {type: 'pawn', id: '8', color: 'white', position: 'h2'}
  ]
}

function getBlackArmy () {
  return {
    king: {type: 'king', id: '', color: 'black', position: 'e8'},
    queen: {type: 'queen', id: '', color: 'black', position: 'd8'},
    rook1: {type: 'rook', id: '1', color: 'black', position: 'a8'},
    rook2: {type: 'rook', id: '2', color: 'black', position: 'h8'},
    bishop1: {type: 'bishop', id: '1', color: 'black', position: 'c8'},
    bishop2: {type: 'bishop', id: '2', color: 'black', position: 'f8'},
    knight1: {type: 'knight', id: '1', color: 'black', position: 'b8'},
    knight2: {type: 'knight', id: '2', color: 'black', position: 'g8'},
    pawn1: {type: 'pawn', id: '1', color: 'black', position: 'a7'},
    pawn2: {type: 'pawn', id: '2', color: 'black', position: 'b7'},
    pawn3: {type: 'pawn', id: '3', color: 'black', position: 'c7'},
    pawn4: {type: 'pawn', id: '4', color: 'black', position: 'd7'},
    pawn5: {type: 'pawn', id: '5', color: 'black', position: 'e7'},
    pawn6: {type: 'pawn', id: '6', color: 'black', position: 'f7'},
    pawn7: {type: 'pawn', id: '7', color: 'black', position: 'g7'},
    pawn8: {type: 'pawn', id: '8', color: 'black', position: 'h7'}
  }
}

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

class Board {
  movePiece (oldPosition, newPosition) {
    return this.drawPiece(newPosition, this.getPiece(oldPosition))
  }
  setPieceDraggable (position, value = true) {
    this.getPiece(position).setAttribute('draggable', value)
    return this.getPiece(position)
  }
  removePiece (position) {
    return this.getPiece(position).remove()
  }
  createPiece (color, type, id) {
    let piece = document.createElement('div')
    piece.classList.add('piece')
    piece.classList.add(color + '-' + type)
    piece.id = color + type + id
    return piece
  }
  drawPiece (position, piece) {
    return document.getElementById(position).appendChild(piece)
  }
  getPiece (position) {
    return document.getElementById(position).firstChild
  }
  getSquares () {
    return Array.from(document.getElementsByClassName('square'))
  }
  clearLastMove () {
    const moveClasses = ['move-target', 'move-source']

    moveClasses.forEach((moveClass) => {
      Array.from(document.getElementsByClassName(moveClass))
        .forEach((squareEl) => {
          console.log('heyyy')
          squareEl.classList.remove(moveClass)
        })
    })
  }
}
