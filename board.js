'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')

// function setDraggableAt (position) {
//   getPieceEl(position).setAttribute('draggable', true)
//   return getPieceEl(position)
// }

const getSlug = piece => piece.color + piece.type + piece.id

const setDraggable = _.curry((handler, piece) => {
  const slug = getSlug(piece)
  const pieceEl = document.getElementById(slug)
  pieceEl.setAttribute('draggable', true)
  addListener('dragstart', handler, pieceEl)
  return pieceEl
})

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

function drawPiece (piece, position) {
  const pieceEl = createPieceEl(piece.color, piece.type, piece.id)
  return document.getElementById(position).appendChild(pieceEl)
}

// function getPieceEl (position) {
//   return document.getElementById(position).firstChild
// }

function getSquaresEl () {
  return Array.from(document.getElementsByClassName('square'))
}

function getSquareEl (position) {
  return document.getElementById(position)
}

function clearLastMove () {
  const moveClasses = ['move-target', 'move-source', 'move-available']

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
const setMoveAvailable = addClass('move-available')
// const unSetMoveAvailable = addClass('move-available')
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

const drawMatrix = matrix => {
  M.forEachPosition(drawPiece, matrix)
}

function showPossibleMoves (possibleMoves) {
  _.forEach(position => {
    setMoveAvailable(getSquareEl(position))
  }, _.map(_.path(['update', 'position']), possibleMoves))
}

// const showPossibleMoves = _.compose(
//   _.forEach(_.compose(setMoveAvailable, getSquareEl)),
//   _.map(_.path(['update', 'position']))
// )

module.exports = {
  setDraggable,
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
