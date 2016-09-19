function main(){
  let whiteArmy = getWhiteArmy();
  let blackArmy = getBlackArmy();

  const board = new Board(blackArmy, whiteArmy)

  window.setTimeout(function(){
    whiteArmy.pawn1 = board.setPiecePosition(whiteArmy.pawn1, "a4")
  }, 2000)
}


function getWhiteArmy(){
  return {
    king:    {type: "king",  id: "",  color:"white",   position: "e1"},
    queen:   {type: "queen", id: "",  color:"white",  position: "d1"},
    rook1:   {type: "rook",  id: "1", color:"white",   position: "a1"},
    rook2:   {type: "rook",  id: "2", color:"white",   position: "h1"},
    bishop1: {type: "bishop",id: "1", color:"white", position: "c1"},
    bishop2: {type: "bishop",id: "2", color:"white", position: "f1"},
    knight1: {type: "knight",id: "1", color:"white", position: "b1"},
    knight2: {type: "knight",id: "2", color:"white", position: "g1"},
    pawn1:   {type: "pawn",  id: "1", color:"white",   position: "a2"},
    pawn2:   {type: "pawn",  id: "2", color:"white",   position: "b2"},
    pawn3:   {type: "pawn",  id: "3", color:"white",   position: "c2"},
    pawn4:   {type: "pawn",  id: "4", color:"white",   position: "d2"},
    pawn5:   {type: "pawn",  id: "5", color:"white",   position: "e2"},
    pawn6:   {type: "pawn",  id: "6", color:"white",   position: "f2"},
    pawn7:   {type: "pawn",  id: "7", color:"white",   position: "g2"},
    pawn8:   {type: "pawn",  id: "8", color:"white",   position: "h2"}
  }
}

function getBlackArmy(){
  return {
    king:    {type: "king",   id: "",  color: "black",   position: "e8"},
    queen:   {type: "queen",  id: "",  color: "black",  position: "d8"},
    rook1:   {type: "rook",   id: "1", color: "black",   position: "a8"},
    rook2:   {type: "rook",   id: "2", color: "black",   position: "h8"},
    bishop1: {type: "bishop", id: "1", color: "black", position: "c8"},
    bishop2: {type: "bishop", id: "2", color: "black", position: "f8"},
    knight1: {type: "knight", id: "1", color: "black", position: "b8"},
    knight2: {type: "knight", id: "2", color: "black", position: "g8"},
    pawn1:   {type: "pawn",   id: "1", color: "black",   position: "a7"},
    pawn2:   {type: "pawn",   id: "2", color: "black",   position: "b7"},
    pawn3:   {type: "pawn",   id: "3", color: "black",   position: "c7"},
    pawn4:   {type: "pawn",   id: "4", color: "black",   position: "d7"},
    pawn5:   {type: "pawn",   id: "5", color: "black",   position: "e7"},
    pawn6:   {type: "pawn",   id: "6", color: "black",   position: "f7"},
    pawn7:   {type: "pawn",   id: "7", color: "black",   position: "g7"},
    pawn8:   {type: "pawn",   id: "8", color: "black",   position: "h7"}
  }
}

class Board {
  constructor(blackArmy, whiteArmy) {
    [blackArmy, whiteArmy].forEach((army) => {
      Object.values(army).forEach((piece) => this.setPiecePosition(piece))
    })
    this.setupDragHandlers()
    this.setArmyDraggable(whiteArmy)
  }
  setPiecePosition(oldPiece, newPosition) {
    let newPiece = Object.assign({}, oldPiece)
    if (newPosition) {
      this.getPieceEl(oldPiece.position).remove()
      newPiece.position = newPosition
    }
    this.addPieceEl(newPiece)

    return newPiece
  }
  setArmyDraggable(army, dragValue = true) {
    Object.values(army).forEach((piece) => this.setPieceDraggable(piece, dragValue))
  }
  setPieceDraggable(piece, dragValue = true) {
    let pieceEl = this.getPieceEl(piece.position)
    pieceEl.setAttribute('draggable', dragValue)
    pieceEl.addEventListener("dragstart", this.pieceDragStart, false)
  }
  addPieceEl(piece){
    let pieceEl = document.createElement("div")
    pieceEl.classList.add("piece")
    pieceEl.classList.add(piece.color + "-" + piece.type)
    pieceEl.id = piece.color + piece.type + piece.id

    pieceEl.addEventListener("dragenter", this.pieceDragEnter, false)
    pieceEl.addEventListener("dragleave", this.pieceDragLeave, false)

    document.getElementById(piece.position)
      .appendChild(pieceEl)
  }
  getPieceEl(position){
    return document
    .getElementById(position)
    .getElementsByClassName("piece")[0]
  }
  setupDragHandlers(){
    [].forEach.call(document.getElementsByClassName("square"), (squareEl) => {
      squareEl.addEventListener("dragover", this.squareDragOver, false)
      squareEl.addEventListener("dragenter", this.squareDragEnter, false)
      squareEl.addEventListener("dragleave", this.squareDragLeave, false)
      squareEl.addEventListener("drop", this.squareDrop, false)
    })
  }
  squareDragEnter(ev){
    ev.target.classList.add("move-target")
  }
  squareDragOver(ev){
    ev.preventDefault()
  }
  squareDragLeave(ev){
    ev.target.classList.remove("move-target")
  }
  pieceDragEnter(ev){
    ev.target.parentNode.classList.add("move-target")
  }
  pieceDragLeave(ev){
    ev.target.parentNode.classList.remove("move-target")
  }
  squareDrop(ev){
    ev.preventDefault()
    const data = JSON.parse(ev.dataTransfer.getData("text/plain"))
    let squareEl = ev.target
    let pieceEl
    if (squareEl.classList.contains('piece')){
      squareEl = ev.target.parentNode
      // ev.target.remove()
      pieceEl = ev.target
    }
    console.log('data.availableTargets',data.availableTargets);
    console.log('squareEl.id',squareEl.id);

    if(data.availableTargets.indexOf(squareEl.id) === -1) {
      console.log('not availableTargets');
      return
    }

    const newPieceEl = document.getElementById(data.id)
    if (pieceEl) pieceEl.remove()
    squareEl.appendChild(newPieceEl)
  }
  pieceDragStart(ev){
    let data = {
      id: ev.currentTarget.id
    }
    data.availableTargets = [
      "a6",
      "b6",
      "c6",
      "d6",
      "e6",
      "f6",
      "g6",
      "h6"
    ]
    ev.dataTransfer.setData("text/plain", JSON.stringify(data))

    ;[].forEach.call(document.getElementsByClassName("move-target"), (squareEl) => {
      console.log('heyyy');
      squareEl.classList.remove("move-target")
    })

    ;[].forEach.call(document.getElementsByClassName("move-source"), (squareEl) => {
      squareEl.classList.remove("move-source")
    })

    ev.currentTarget.parentNode.classList.add("move-source")

    // TODO: for nice drag and drop in chrome
    // event.dataTransfer.setDragImage(image, xOffset, yOffset);

  }
}
