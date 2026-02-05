# Current Codebase Analysis

## Overview
This document provides a comprehensive analysis of the existing codebase to help developers understand what exists, what can be reused, and what needs modification for new features.

---

## 1) Tech Stack

| Layer | Technology | Version/Source |
|-------|------------|----------------|
| Frontend | Vanilla JavaScript + jQuery 3.1.1 | CDN |
| CSS Framework | Bootstrap 3.3.7 | CDN |
| Backend | Express.js 4.14.0 | npm |
| Bundler | Browserify + Watchify | npm (dev) |
| Dev Server | Nodemon | npm |

**No TypeScript, no React, no build-time transpilation.**

---

## 2) File Structure

```
Pathfinding-Visualizer/
├── index.html              # Single HTML entry point
├── server.js               # Express static server (port 1337)
├── package.json            # Dependencies & scripts
│
├── public/
│   ├── browser/
│   │   ├── board.js        # Main controller (1115 LOC) ⚠️ God Object
│   │   ├── node.js         # Node data model (27 LOC)
│   │   ├── getDistance.js  # Direction/distance utility (54 LOC)
│   │   ├── bundle.js       # Browserify output (do not edit)
│   │   │
│   │   ├── pathfindingAlgorithms/
│   │   │   ├── weightedSearchAlgorithm.js   # Dijkstra, Swarm, Greedy
│   │   │   ├── unweightedSearchAlgorithm.js # BFS, DFS
│   │   │   ├── astar.js                     # A* Search
│   │   │   ├── bidirectional.js             # Bidirectional Swarm
│   │   │   └── testAlgorithm.js             # Empty placeholder
│   │   │
│   │   ├── mazeAlgorithms/
│   │   │   ├── recursiveDivisionMaze.js     # Main maze generator
│   │   │   ├── otherMaze.js                 # Vertical skew variant
│   │   │   ├── otherOtherMaze.js            # Horizontal skew variant
│   │   │   ├── stairDemonstration.js
│   │   │   ├── weightsDemonstration.js
│   │   │   └── simpleDemonstration.js
│   │   │
│   │   └── animations/
│   │       ├── launchAnimations.js          # Animated visualization
│   │       ├── launchInstantAnimations.js   # Instant (no animation)
│   │       └── mazeGenerationAnimations.js  # Maze building animation
│   │
│   └── styling/
│       ├── cssBasic.css    # Main stylesheet (7000+ LOC)
│       ├── cssPokemon.css  # Alternate theme
│       └── fonts/          # Glyphicons, Lato
```

---

## 3) Data Models

### Node (`node.js`)
```javascript
function Node(id, status) {
  this.id = id;                    // "row-col" format, e.g., "5-10"
  this.status = status;            // "unvisited" | "visited" | "wall" | "start" | "target"
  this.previousNode = null;        // For path reconstruction
  this.path = null;                // Movement sequence
  this.direction = null;           // "up" | "down" | "left" | "right"
  this.storedDirection = null;     // For re-runs
  this.distance = Infinity;        // g(n) - distance from start
  this.totalDistance = Infinity;   // f(n) = g(n) + h(n) for A*
  this.heuristicDistance = null;   // h(n) - estimated to target
  this.weight = 0;                 // Extra cost (0 or 15 currently)
  
  // Bidirectional search properties
  this.otherpreviousNode = null;
  this.otherdistance = Infinity;
  this.otherdirection = null;
}
```

### Board (`board.js` constructor)
```javascript
function Board(height, width) {
  // Grid dimensions
  this.height = height;
  this.width = width;
  
  // Special nodes
  this.start = null;               // Start node ID
  this.target = null;              // Target node ID
  
  // Data structures
  this.boardArray = [];            // 2D array of Nodes
  this.nodes = {};                 // Hash map {id: Node} for O(1) lookup
  
  // Animation queues
  this.nodesToAnimate = [];
  this.shortestPathNodesToAnimate = [];
  this.wallsToAnimate = [];
  
  // Interaction state
  this.mouseDown = false;
  this.pressedNodeStatus = "normal";
  this.previouslyPressedNodeStatus = null;
  this.previouslySwitchedNode = null;
  this.previouslySwitchedNodeWeight = 0;
  this.keyDown = false;
  
  // Algorithm state
  this.algoDone = false;
  this.currentAlgorithm = null;
  this.currentHeuristic = null;
  
  // UI state
  this.buttonsOn = false;
  this.speed = "fast";             // "fast" | "average" | "slow"
}
```

---

## 4) Key Functions by File

### `board.js` (Main Controller)

| Function | Lines | Purpose |
|----------|-------|---------|
| `initialise()` | 44-47 | Entry point: createGrid + addEventListeners + toggleTutorialButtons |
| `createGrid()` | 48-71 | Build HTML table + Node objects |
| `addEventListeners()` | 73-130 | Mouse events for drawing/dragging |
| `getNode(id)` | 132-137 | Get Node by "row-col" ID |
| `changeSpecialNode()` | 139-180 | Handle drag of start/target/bomb |
| `changeNormalNode()` | 182-201 | Toggle wall/weight on click |
| `drawShortestPath()` | 203-260 | Trace back path from target |
| `drawShortestPathTimeout()` | 270-370 | Animated path drawing |
| `createMazeOne()` | 372-390 | Random maze generator |
| `clearPath()` | 392-520 | Reset visited nodes + main Visualize handler |
| `clearWalls()` | 522-534 | Remove all walls |
| `clearWeights()` | 536-548 | Remove all weights |
| `instantAlgorithm()` | 562-610 | Run algorithm without animation |
| `redoAlgorithm()` | 612-615 | Re-run after dragging nodes |
| `toggleTutorialButtons()` | 686-758 | 9-step tutorial system |
| `toggleButtons()` | 760-1095 | Enable/disable all UI + event handlers |

### `weightedSearchAlgorithm.js`

| Function | Purpose |
|----------|---------|
| `weightedSearchAlgorithm()` | Main entry for Dijkstra/Swarm/Greedy |
| `closestNode()` | Find min-distance node (O(n) scan) |
| `updateNeighbors()` | Process all neighbors of current |
| `updateNode()` | Relaxation step with cost calculation |
| `getNeighbors()` | Get 4-directional neighbors |
| `getDistance()` | Calculate edge cost including turn penalty |
| `manhattanDistance()` | Heuristic function |

### `astar.js`

| Function | Purpose |
|----------|---------|
| `astar()` | A* with f(n) = g(n) + h(n) |
| `closestNode()` | Find min totalDistance node |
| `updateNode()` | Update with heuristic consideration |

### `unweightedSearchAlgorithm.js`

| Function | Purpose |
|----------|---------|
| `unweightedSearchAlgorithm()` | BFS (queue) or DFS (stack) |
| `getNeighbors()` | 4-directional, order differs for BFS/DFS |

### `launchAnimations.js`

| Function | Purpose |
|----------|---------|
| `launchAnimations()` | Main animation loop with setTimeout |
| `timeout()` | Recursive step-by-step animation |
| `change()` | Update single node's CSS class |
| `shortestPathTimeout()` | Animate the final path |

---

## 5) Algorithm Implementations

### Supported Algorithms

| Algorithm | File | Weighted | Guaranteed Shortest |
|-----------|------|----------|---------------------|
| Dijkstra | weightedSearchAlgorithm.js | ✅ | ✅ |
| A* | astar.js | ✅ | ✅ |
| Greedy Best-first | weightedSearchAlgorithm.js | ✅ | ❌ |
| Swarm | weightedSearchAlgorithm.js | ✅ | ❌ |
| Convergent Swarm | weightedSearchAlgorithm.js | ✅ | ❌ |
| Bidirectional Swarm | bidirectional.js | ✅ | ❌ |
| BFS | unweightedSearchAlgorithm.js | ❌ | ✅ |
| DFS | unweightedSearchAlgorithm.js | ❌ | ❌ |

### Cost Model (Current)
```javascript
// Edge cost = base + turn penalty + weight
// Base: 1 (always)
// Turn penalty: 1 (straight), 2 (90°), 3 (180°)
// Weight: 0 (normal) or 15 (weight node) — HARDCODED

// From getDistance():
// Returns [cost, path, direction]
// e.g., [2, ["l", "f"], "up"] = cost 2, turn left then forward, facing up
```

---

## 6) Known Issues & Technical Debt

### Critical for New Features

| Issue | Location | Impact on New Features |
|-------|----------|------------------------|
| **Hardcoded weight=15** | `board.js:197`, `weightedSearchAlgorithm.js:65` | Must fix for cost experimentation |
| **No trace/logging** | All algorithms | Must add for step-by-step explanations |
| **God object (board.js)** | 1115 LOC single file | Hard to add features cleanly |
| **No state serialization** | N/A | Must implement for history |

### Performance Issues

| Issue | Location | Severity |
|-------|----------|----------|
| O(n) closestNode scan | weightedSearchAlgorithm.js:29-38 | Medium (should use heap) |
| Repeated DOM queries | Throughout | Low-Medium |
| No animation cancellation | launchAnimations.js | Low |

### Code Quality

| Issue | Description |
|-------|-------------|
| Global variables | `counter`, `newBoard` at module level |
| Duplicated getDistance() | Exists in multiple files with same logic |
| Mixed concerns | DOM manipulation in algorithm files |
| No error handling | No try/catch, minimal validation |

---

## 7) What Can Be Reused

### ✅ Reuse Directly
- Node data model structure
- Algorithm core logic (Dijkstra, A*, BFS, DFS)
- Maze generation algorithms
- CSS animations and styles
- HTML structure

### ⚠️ Reuse with Modification
- `weightedSearchAlgorithm.js` — add trace, remove hardcoded weight
- `astar.js` — add trace events
- `board.js` — extract serialization, add history hooks
- Cost calculation in `getDistance()` — make configurable

### ❌ Must Create New
- Trace collector system
- Explanation templates
- localStorage persistence layer
- History UI components
- Weight slider UI
- Run summary display

---

## 8) Entry Points & Data Flow

### Initialization Flow
```
index.html loads
    ↓
bundle.js executes
    ↓
board.js bottom: new Board(height, width)
    ↓
newBoard.initialise()
    ↓
├── createGrid()      → Build DOM table + Node objects
├── addEventListeners() → Mouse handlers
└── toggleTutorialButtons() → Show tutorial
```

### Visualization Flow
```
User clicks "Visualize!"
    ↓
toggleButtons() → startButtonStart.onclick
    ↓
clearPath("clickedButton") → Reset state
    ↓
Algorithm function (e.g., weightedSearchAlgorithm)
    ↓
├── Returns "success" or false
├── Populates nodesToAnimate[]
└── Sets node.previousNode for path
    ↓
launchAnimations(board, success, type)
    ↓
setTimeout loop animates each node
    ↓
drawShortestPathTimeout() animates path
    ↓
toggleButtons() → Re-enable UI
```

### Mouse Interaction Flow
```
mousedown on cell
    ↓
Is it start/target?
├── Yes → pressedNodeStatus = special, enable drag
└── No  → changeNormalNode() → toggle wall/weight
    ↓
mousemove (if mouseDown)
    ↓
Is pressedNodeStatus special?
├── Yes → changeSpecialNode() → move special node
│         if algoDone → redoAlgorithm()
└── No  → changeNormalNode() → draw walls
    ↓
mouseup → reset pressedNodeStatus
```

---

## 9) Integration Points for New Features

### For Step-by-Step Explanations
- **Where to add trace:** Inside while loops of each algorithm
- **Data needed:** current node, neighbors considered, costs calculated
- **Hook point:** After `nodesToAnimate.push()` calls

### For History/localStorage
- **Serialize from:** `board.nodes`, `board.start`, `board.target`, etc.
- **Save trigger:** After algorithm completes (in `launchAnimations`)
- **Load trigger:** New History UI button

### For Cost Experimentation
- **Weight slider:** Add to navbar, store in `board.currentWeightValue`
- **Modify:** `changeNormalNode()` to use dynamic weight
- **Modify:** Algorithm cost calculations to use `node.weight` as-is

---

## 10) Testing Current Functionality

### Manual Test Checklist
- [ ] Grid renders correctly on page load
- [ ] Can draw walls by clicking
- [ ] Can draw weights by holding W + clicking
- [ ] Can drag start/target nodes
- [ ] All 8 algorithms run without errors
- [ ] Animation plays at all 3 speeds
- [ ] Maze generation works (all types)
- [ ] Clear Board/Walls/Path buttons work
- [ ] Tutorial displays and can be skipped

### Browser Console Commands for Debugging
```javascript
// Access board instance
newBoard

// Check current state
newBoard.currentAlgorithm
newBoard.nodes["10-15"]
newBoard.nodesToAnimate.length

// Manually trigger
newBoard.clearPath("clickedButton")
newBoard.redoAlgorithm()
```
