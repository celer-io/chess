'use strict'

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

module.exports = Board
