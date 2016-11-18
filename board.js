'use strict'
const _ = require('ramda')
const M = require('./utils/matrix')
// const trace = _.curry((tag, x) => {
//   console.log(tag, x)
//   return x
// })

// function setDraggableAt (position) {
//   getPieceEl(position).setAttribute('draggable', true)
//   return getPieceEl(position)
// }

const getSlug = piece => piece.color + piece.type + piece.id

function getPieceEl (piece) {
  const slug = getSlug(piece)
  return document.getElementById(slug)
}

const setDraggable = _.curry((handler, piece) => {
  const pieceEl = getPieceEl(piece)
  pieceEl.setAttribute('draggable', true)
  addListener('dragstart', handler, pieceEl)
  return pieceEl
})

const unSetDraggable = (piece) => {
  const pieceEl = getPieceEl(piece)
  pieceEl.setAttribute('draggable', false)
  return pieceEl
}

const unSetDraggables = (pieces) => {
  _.forEach(unSetDraggable, pieces)
}

const setDraggables = _.curry((handler, pieces) => {
  _.forEach(setDraggable(handler), pieces)
})

const clearDraggables = (matrix) => _.compose(unSetDraggables, M.findAll)(matrix)

const setArmyDraggable = (matrix, color, handler) => _.compose(setDraggables(handler), M.findByColor(color))(matrix)

const setWhiteArmyDraggable = (matrix, handler) => setArmyDraggable(matrix, 'white', handler)

const setBlackArmyDraggable = (matrix, handler) => setArmyDraggable(matrix, 'black', handler)

// const setWhiteArmyDraggable = (matrix, handler) => _.compose(setDraggables(handler), M.findWhites)(matrix)
//
// const setBlackArmyDraggable = (matrix, handler) => _.compose(setDraggables(handler), M.findBlacks)(matrix)

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

function getSquaresEl () {
  return getByClass('square')
}

const getSquareEl = (position) => {
  return document.getElementById(position)
}

function getByClass (className) {
  return Array.from(document.getElementsByClassName(className))
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

const clearMoves = (moveClasses) => {
  moveClasses = moveClasses || ['move-target', 'move-source', 'move-available']
  _.forEach(className => {
    _.forEach(removeClass(className), getByClass(className))
  }, moveClasses)
}

const clearAvailableMoves = () => clearMoves(['move-available'])

const niceDragImage = ev => {
    // TODO: for nice drag and drop in chrome
  var img = ev.currentTarget.cloneNode()
  document.getElementById('img-box').appendChild(img)

  ev.dataTransfer.setDragImage(img, 25, 25)
}

const deletePiece = slug => document.getElementById(slug).remove()

const updatePiece = update => document.getElementById(update.position).appendChild(document.getElementById(update.slug))

const drawMatrix = matrix => {
  M.forEachByPosition(drawPiece, matrix)
}

const showPossibleMoves = (possibleMoves, position) => {
  const moves = _.reject(move => !_.equals(move.origin, M.coords(position)), possibleMoves)

  // console.log('moves :', moves)
  _.forEach(move => {
    // console.log('M.position(move.update) :', M.position(move.update))
    setMoveAvailable(document.getElementById(M.position(move.update)))
  }, moves)
}
// const showPossibleMoves = (possibleMoves, position) => {
//   const moves = _.find(move => true, possibleMoves)
//   // _.forEach(position => {
//   //   setMoveAvailable(document.getElementById(position))
//   // }, _.map(_.path(['update', 'position']), possibleMoves))
// }

const drawInstructions = (instructions) => {
  updatePiece(instructions.update)
  _.forEach(deletePiece, instructions.captures)
}

const setSquaresHandlers = (handlers) => {
  _.forEach((square) => {
    addListener('dragover', handlers.onSquareDragOver, square)
    // Board.addListener('dragenter', onSquareDragEnter, square)
    addListener('dragleave', handlers.onSquareDragLeave, square)
    addListener('drop', handlers.onSquareDrop, square)
  }, getSquaresEl())
}

module.exports = {
  setDraggable,
  getSquaresEl,
  clearMoves,
  clearAvailableMoves,
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
  showPossibleMoves,
  // getSquareEl,
  drawInstructions,
  setWhiteArmyDraggable,
  setBlackArmyDraggable,
  setSquaresHandlers,
  getSquareEl,
  clearDraggables,
  setArmyDraggable
}
