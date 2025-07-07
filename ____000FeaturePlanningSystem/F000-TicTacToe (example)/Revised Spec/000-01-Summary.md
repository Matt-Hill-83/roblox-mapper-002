# Tic Tac Toe Summary

Create a tic tac toe game in TypeScript that runs on the command line in Node.js. X's should be red and O's should be blue. Player vs. computer mode.

## ASCII representation of GUI

```
   1   2   3
1  X | O | X
  -----------
2    | X | O
  -----------
3  O |   | X

Enter move (row,col): 2,1
```

## File and Function Structure (ascii)

```
src/
├── index.ts
│   └── main()
├── game.ts
│   └── initBoard()
│   └── displayBoard()
│   └── makeMove()
│   └── checkWin()
│   └── gameLoop()
└── types.ts
    └── Board type
    └── Player type
```

## Flowchart

```mermaid
graph TD
    Start["Start"] --> Init["Initialize Board"]
    Init --> Display["Display Board"]
    Display --> PlayerMove["Player Move"]
    PlayerMove --> Validate{"Valid?"}
    Validate -->|No| PlayerMove
    Validate -->|Yes| PlaceX["Place X"]
    PlaceX --> CheckWin1{"Win/Draw?"}
    CheckWin1 -->|Yes| End["Game Over"]
    CheckWin1 -->|No| CompMove["Computer Move"]
    CompMove --> PlaceO["Place O"]
    PlaceO --> CheckWin2{"Win/Draw?"}
    CheckWin2 -->|Yes| End
    CheckWin2 -->|No| Display
```