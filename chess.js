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

// //TODO: handle drag and drop...
// function drag_handler(ev) {
//   ev.dataTransfer.setData('text/plain', 'dummy')
//   console.log("Drag")
//   console.log();
// }
//
// function dragstart_handler(ev) {
//   ev.dataTransfer.setData('text/plain', 'dummy')
//   console.log("dragStart")
// }
//
// function drop_handler(ev) {
//   ev.dataTransfer.setData('text/plain', 'dummy')
//   console.log("Drop")
// }
//
// function dragover_handler(ev) {
//   ev.dataTransfer.setData('text/plain', 'dummy')
//   console.log("dragOver")
// }

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
      let oldPieceData = this.getPieceEl(oldPiece.position).dataset

      delete oldPieceData.type
      delete oldPieceData.color
      delete oldPieceData.id

      newPiece.position = newPosition
    }

    let newPieceData = this.getPieceEl(newPiece.position).dataset

    newPieceData.type = newPiece.type
    newPieceData.color = newPiece.color
    newPieceData.id = newPiece.id

    return newPiece
  }
  setArmyDraggable(army, dragValue = true) {
    Object.values(army).forEach((piece) => this.setPieceDraggable(piece, dragValue))
  }
  setPieceDraggable(piece, dragValue = true) {
    let pieceEl = this.getPieceEl(piece.position)
    pieceEl.draggable = dragValue
  }
  getPieceEl(position){
    return document
    .getElementById(position)
    .getElementsByClassName("piece")[0]
  }
  setupDragHandlers(){
    let squares = document.getElementsByClassName("square")
    for (let i = 0; i < squares.length; i++) {
      squares.item(i).addEventListener("dragstart", this.handleDragStart, false);
      squares.item(i).addEventListener("dragstart", this.handleDragStart, false);
    }
  }
}
