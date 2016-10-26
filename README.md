# Chess2

An attempt to build a chess game engine in web technologies that implements the set of rules of the so called game chess2.

## State machine

#### Diagram

![Chess2 FSM](/modeling/fsm.png?raw=true)

#### States definition

- **S** 		: Start
- **P1T** 	: Player 1 turn
- **P2T** 	: Player 2 turn
- **P1D** 	: Duel initiated by Player 1
- **P2D** 	: Duel initiated by Player 2
- **P1KT** 	: Player 1 king turn if his army is of type Two kings
- **P2KT** 	: Player 2 king turn if his army is of type Two kings
- **P1W** 	: Player 1 has won
- **P2W** 	: Player 2 has won
- **PAT** 	: (aka: Stalemate) Player whose turn it is to move is not in check but has no legal move

## Roadmap

- [x] Display possible moves on board
- [ ] Create simple game automata: Allow player one to play white then player 2 black...
- [ ] Refactor event handling to FSM
- [ ] Move black pieces
- [ ] Implement 'has won' rule
- [ ] Handle dueling
- [ ] Handle end of game
- [ ] Display game state in a dashboard
- [ ] Implement Nemesis rules
- [ ] Implement Two king rules
- [ ] Implement Jungle rules
- [ ] Implement Empowered rules
- [ ] Implement Reaper rules
