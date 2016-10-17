'use strict'
const _ = require('ramda')

// function movePiece (oldPosition, newPosition) {
//   return drawPiece(newPosition, getPiece(oldPosition))
// }

function setDraggableAt (position) {
  getPieceEl(position).setAttribute('draggable', true)
  return getPieceEl(position)
}

// function removePiece (position) {
//   return getPiece(position).remove()
// }

function createPieceEl (color, type, id) {
  let piece = document.createElement('div')
  piece.classList.add('piece')
  piece.classList.add(color + '-' + type)
  piece.id = color + type + id
  return piece
}

function drawPieceEl (position, piece) {
  return document.getElementById(position).appendChild(piece)
}

function getPieceEl (position) {
  return document.getElementById(position).firstChild
}

function getSquaresEl () {
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

const addListener = _.curry((eventName, handler, element) => element.addEventListener(eventName, handler, true))
const addClass = _.curry((className, element) => element.classList.add(className))
const removeClass = _.curry((className, element) => element.classList.remove(className))

const setMoveTarget = addClass('move-target')
const unSetMoveTarget = removeClass('move-target')
const setMoveSource = addClass('move-source')
const getData = ev => JSON.parse(ev.dataTransfer.getData('text/plain'))
const setData = (ev, data) => ev.dataTransfer.setData('text/plain', JSON.stringify(data))

const niceDragImage = ev => {
    // TODO: for nice drag and drop in chrome
  var img = ev.currentTarget.cloneNode()
  document.getElementById('img-box').appendChild(img)

  ev.dataTransfer.setDragImage(img, 25, 25)
}

const deletePiece = slug => document.getElementById(slug).remove()

const updatePiece = update => document.getElementById(update.position).appendChild(document.getElementById(update.slug))

const createPiece = piece => drawPieceEl(piece.position, createPieceEl(piece.color, piece.type, piece.id)) // To refactor

  // matrix
const drawMatrix = _.compose(_.forEach(createPiece), _.reject(_.isNil), _.flatten)

function showPossibleMoves (possibleMoves) {

}

module.exports = {
  createPiece,
  drawPieceEl,
  setDraggableAt,
  getSquaresEl,
  clearLastMove,
  addListener,
  setMoveTarget,
  unSetMoveTarget,
  setMoveSource,
  getData,
  setData,
  niceDragImage,
  deletePiece,
  updatePiece,
  drawMatrix,
  showPossibleMoves
}
