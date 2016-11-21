# Chess2

An attempt to build a chess game engine in web technologies that implements the set of rules of the so called game chess2.

## State machine

#### Diagram

![Chess2 FSM](/modeling/fsm.png?raw=true)

#### States definition

<!-- - **S** 		: Start -->
- **P1T** 	: White player turn
- **P2T** 	: Black player turn
- **P1D** 	: Duel initiated by White player
- **P2D** 	: Duel initiated by Black player
- **P1KT** 	: White player king turn if his army is of type Two kings
- **P2KT** 	: Black player king turn if his army is of type Two kings
- **P1W** 	: White player has won
- **P2W** 	: Black player has won
- **PAT** 	: (aka: Stalemate) Player whose turn it is to move is not in check but has no legal move

## Roadmap

- [x] Display possible moves on board
- [X] Create simple game automata: Allow player one to play white then Black player...
- [ ] Refactor event handling to FSM
- [X] Move black pieces
- [X] Implement in check rule
- [X] Rename captures to capture
- [X] Add nice matrix log
- [X] Compute army possible moves on state change
- [X] Implement in checkmate rule
- [X] Implement in stalemate rule
- [X] Implement midline invasion rule
- [ ] Handle dueling
- [ ] Handle end of game
- [ ] Display game state in a dashboard
- [X] Implement Nemesis rules
- [ ] Implement Two king rules
- [ ] Implement Jungle rules
- [ ] Implement Empowered rules
- [ ] Implement Reaper rules
- [ ] Add ui for game start and army selection
