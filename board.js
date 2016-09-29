'use strict'

function movePiece (oldPosition, newPosition) {
  return drawPiece(newPosition, getPiece(oldPosition))
}

function setDraggableAt (position) {
  getPiece(position).setAttribute('draggable', true)
  return getPiece(position)
}

function removePiece (position) {
  return getPiece(position).remove()
}

function createPiece (color, type, id) {
  let piece = document.createElement('div')
  piece.classList.add('piece')
  piece.classList.add(color + '-' + type)
  piece.id = color + type + id
  return piece
}

function drawPiece (position, piece) {
  return document.getElementById(position).appendChild(piece)
}

function getPiece (position) {
  return document.getElementById(position).firstChild
}

function getSquares () {
  return Array.from(document.getElementsByClassName('square'))
}

function clearLastMove () {
  const moveClasses = ['move-target', 'move-source']

  moveClasses.forEach((moveClass) => {
    Array.from(document.getElementsByClassName(moveClass))
    .forEach((squareEl) => {
      squareEl.classList.remove(moveClass)
    })
  })
}

module.exports = {
  createPiece,
  drawPiece,
  setDraggableAt,
  getSquares,
  clearLastMove
}
