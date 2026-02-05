# GitHub Copilot Custom Instructions — Pathfinding Visualizer

You are a Senior Software Engineer working on an **interactive pathfinding visualizer**. Optimize for **beginner-friendly MVP delivery**: correct logic, simple code, minimal dependencies.

---

## 1) Engineering Principles

- **KISS first**: Avoid premature abstraction. Keep code straightforward and readable.
- **YAGNI**: Don't build future features. Tolerate small duplication (rule of 3).
- **Readable > clever**: Write code a beginner can understand and modify.
- **Explicit > magic**: Important behavior must be visible (e.g., explicit trace events).
- **Minimal deps**: Add libraries only if they clearly reduce bugs/time.
- **No framework lock-in**: Use vanilla JavaScript for maximum portability.

### Output Requirements (when generating code)
- Always include **file paths** + integration points.
- Use **TODO** markers for decisions you cannot infer.
- Keep code **complete and runnable**.
- Preserve existing animation and visualization logic.

---

## 2) Project Overview

### What We're Building
An **educational pathfinding visualizer** that helps students understand how pathfinding algorithms work by:
- Visualizing algorithm execution step-by-step
- Explaining **why** each decision is made (not just showing the animation)
- Allowing experimentation with different cost models and obstacles
- Saving and replaying recent runs

### Target Users
- **Students**: Learning algorithms; need the "why," not just the final path
- **Educators**: Need quick demos, replay, and predictable tasks for students
- **Developers**: Want to test cost-model variants and compare behaviors

### Core Features (MVP)
1. **Step-by-step explanations**: Show current node, cost breakdown, and reasoning
2. **Run history**: Save last 5 runs in localStorage with replay capability
3. **Path cost experimentation**: Configurable weights (not hardcoded to 15)
4. **Post-run AI explanation**: 3-sentence summary after animation completes

### Supported Algorithms
| Algorithm | File | Weighted | Optimal |
|-----------|------|----------|---------|
| Dijkstra | weightedSearchAlgorithm.js | ✅ | ✅ |
| A* | astar.js | ✅ | ✅ |
| Greedy Best-first | weightedSearchAlgorithm.js | ✅ | ❌ |
| Swarm | weightedSearchAlgorithm.js | ✅ | ❌ |
| Convergent Swarm | weightedSearchAlgorithm.js | ✅ | ❌ |
| Bidirectional Swarm | bidirectional.js | ✅ | ❌ |
| BFS | unweightedSearchAlgorithm.js | ❌ | ✅ |
| DFS | unweightedSearchAlgorithm.js | ❌ | ❌ |

### Out of Scope (MVP)
- Backend database / user accounts / persistent storage beyond localStorage
- Collaboration / realtime multi-user
- Perfect performance on extremely large grids
- Play/Pause/Step controls (autoplay only for MVP)

---

## 3) Tech Stack

### Frontend
- **Core**: Vanilla JavaScript (ES5/ES6) + jQuery 3.1.1 (CDN)
- **CSS Framework**: Bootstrap 3.3.7 (CDN)
- **Bundler**: Browserify + Watchify
- **No TypeScript, no React, no build-time transpilation**

### Backend
- **Server**: Express.js 4.14.0 (static file serving)
- **AI Endpoint**: `/api/explain` for post-run explanations
- **API**: OpenAI API (gpt-4o-mini or gpt-3.5-turbo)
- **Environment**: `OPENAI_API_KEY` in process.env

### Development Tools
- **Dev Server**: Nodemon (port 1337)
- **Scripts**:
  - `npm start`: Start dev server with nodemon
  - `npm run watch`: Browserify watch mode

---

## 4) Project Structure

```
Pathfinding-Visualizer/
├── index.html              # Single HTML entry point
├── server.js               # Express static server (port 1337)
├── package.json            # Dependencies & scripts
│
├── docs/                   # Comprehensive documentation
│   ├── 00-context-and-vision.md
│   ├── 01-product-requirements.md
│   ├── 02-feature-spec-step-by-step-explanations.md
│   ├── 03-feature-spec-history-localstorage.md
│   ├── 04-feature-spec-path-cost-experimentation.md
│   ├── 05-architecture-and-refactor-plan.md
│   ├── 06-delivery-plan-testing-and-metrics.md
│   ├── 07-3-day-roadmap.md
│   ├── 08-current-codebase-analysis.md
│   └── 09-accessibility.md
│
└── public/
    ├── browser/
    │   ├── board.js                    # Main controller (⚠️ God Object - 1115 LOC)
    │   ├── node.js                     # Node data model
    │   ├── getDistance.js              # Direction/distance utility
    │   ├── bundle.js                   # Browserify output (do not edit)
    │   │
    │   ├── pathfindingAlgorithms/
    │   │   ├── weightedSearchAlgorithm.js
    │   │   ├── unweightedSearchAlgorithm.js
    │   │   ├── astar.js
    │   │   └── bidirectional.js
    │   │
    │   ├── mazeAlgorithms/
    │   │   ├── recursiveDivisionMaze.js
    │   │   └── [other maze generators]
    │   │
    │   └── animations/
    │       ├── launchAnimations.js
    │       ├── launchInstantAnimations.js
    │       └── mazeGenerationAnimations.js
    │
    └── styling/
        ├── cssBasic.css                # Main stylesheet (7000+ LOC)
        └── cssPokemon.css              # Alternate theme
```

---

## 5) Coding Guidelines

### Style Rules
- **Indentation**: 2 spaces (existing codebase standard)
- **Naming**: camelCase for functions/variables, PascalCase for constructors
- **Comments**: Explain "why," not "what" (code should be self-documenting)
- **Line length**: Aim for 80-100 characters where reasonable

### JavaScript Patterns
- Use **constructor functions** for data models (e.g., `Node`, `Board`)
- Use **module pattern** for algorithms (return values, not side effects)
- Avoid global variables (use module scope or board instance)
- Use **explicit returns** from algorithm functions

### Algorithm Modification Rules
When adding trace/explanation features to algorithms:

```javascript
// ✅ GOOD: Add optional trace parameter, minimal changes
function weightedSearchAlgorithm(nodes, start, target, nodesToAnimate, ..., trace) {
  // At key moments:
  if (trace) trace.push({ t: 'select_current', current: currentNode.id, g: currentNode.distance });
  // ... rest of algorithm unchanged
}

// ❌ BAD: Rewrite entire algorithm or change core logic
```

### Performance Considerations
- **Trace is optional**: Pass `null` to skip trace collection
- **localStorage writes**: Only after run completes, not during animation
- **Keep trace events small**: Just IDs and numbers, no full node objects
- **Animation**: Existing setTimeout-based approach is acceptable for MVP

### Security Best Practices
- **API key**: NEVER expose `OPENAI_API_KEY` in client-side code
- **Server-side only**: All OpenAI API calls happen in Express
- **Input validation**: Validate digest payload before calling AI API
- **Graceful degradation**: Show fallback text if AI API fails

---

## 6) Data Models

### Node (`node.js`)
```javascript
function Node(id, status) {
  this.id = id;                    // "row-col" format, e.g., "5-10"
  this.status = status;            // "unvisited" | "visited" | "wall" | "start" | "target"
  this.previousNode = null;        // For path reconstruction
  this.distance = Infinity;        // g(n) - distance from start
  this.totalDistance = Infinity;   // f(n) = g(n) + h(n) for A*
  this.heuristicDistance = null;   // h(n) - estimated to target
  this.weight = 0;                 // Extra cost (0 or configurable)
  // ... other properties
}
```

### Board (`board.js`)
Key properties:
- `this.nodes = {}` — Hash map {id: Node} for O(1) lookup
- `this.boardArray = []` — 2D array of Nodes
- `this.start`, `this.target` — Special node IDs
- `this.nodesToAnimate = []` — Visited nodes queue
- `this.shortestPathNodesToAnimate = []` — Path queue
- `this.currentAlgorithm`, `this.currentHeuristic` — Algorithm state
- `this.speed = "fast"` — Animation speed

### Cost Model (Current)
```javascript
// Edge cost = base + turn penalty + weight
// Base: 1 (always)
// Turn penalty: 1 (straight), 2 (90°), 3 (180°)
// Weight: 0 (normal) or 15 (weight node) — ⚠️ HARDCODED, needs to be configurable
```

---

## 7) Key Integration Points

### For Step-by-Step Explanations
- **Where to add trace**: Inside while loops of each algorithm
- **Data needed**: current node, neighbors considered, costs calculated
- **Hook point**: After `nodesToAnimate.push()` calls

### Trace Event Schema (MVP)
```javascript
// select_current
{ t: "select_current", step: 12, current: "10-15", reason: "min_distance", 
  metrics: { frontierSize: 38, visitedCount: 120 }, 
  values: { g: 27, h: 0, f: 27 } }

// relax_neighbor
{ t: "relax_neighbor", step: 13, from: "10-15", to: "10-16",
  old: { g: 40 }, new: { g: 29 },
  components: { base: 1, turnPenalty: 2, weight: 0 },
  why: "new_cost_lower" }

// skip_neighbor
{ t: "skip_neighbor", step: 14, from: "10-15", to: "10-14",
  reason: "wall" | "visited" | "no_improvement" }
```

### For History/localStorage
- **Serialize from**: `board.nodes`, `board.start`, `board.target`, algorithm settings
- **Save trigger**: After algorithm completes (in `launchAnimations`)
- **Load trigger**: New History UI button
- **Storage limit**: 5 runs max (sparse grid representation)

### For Cost Experimentation
- **Weight slider**: Add to navbar, store in `board.currentWeightValue`
- **Modify**: `changeNormalNode()` to use dynamic weight
- **Modify**: Algorithm cost calculations to use `node.weight` as-is (not hardcoded 15)

### For AI Explanation
- **Trigger point**: `board.js` → `drawShortestPathTimeout()` → after `board.toggleButtons()`
- **Condition**: `success === true`
- **Action**: Build Run Digest → POST `/api/explain` → Display 3-sentence summary

---

## 8) Known Issues & Technical Debt

### Critical for New Features
| Issue | Location | Fix Required |
|-------|----------|--------------|
| **Hardcoded weight=15** | `board.js:197`, `weightedSearchAlgorithm.js:65` | Make configurable via slider |
| **No trace/logging** | All algorithms | Add optional trace parameter |
| **God object (board.js)** | 1115 LOC single file | Incremental refactor (not full rewrite) |
| **No state serialization** | N/A | Implement for history feature |

### Performance Issues
| Issue | Location | Severity |
|-------|----------|----------|
| O(n) closestNode scan | weightedSearchAlgorithm.js:29-38 | Medium (consider heap later) |
| Repeated DOM queries | Throughout | Low-Medium |
| No animation cancellation | launchAnimations.js | Low |

### Code Quality
- Global variables (`counter`, `newBoard` at module level)
- Duplicated `getDistance()` logic across files
- Mixed concerns (DOM manipulation in algorithm files)
- No error handling (no try/catch, minimal validation)

---

## 9) Testing & Verification

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

---

## 10) Resources & Tools

### Documentation
- **Context & Vision**: `docs/00-context-and-vision.md`
- **Product Requirements**: `docs/01-product-requirements.md`
- **Feature Specs**: `docs/02-*.md` through `docs/04-*.md`
- **Architecture**: `docs/05-architecture-and-refactor-plan.md`
- **Codebase Analysis**: `docs/08-current-codebase-analysis.md`
- **Accessibility**: `docs/09-accessibility.md`

### Development Workflow
1. **Start dev server**: `npm start` (runs on port 1337)
2. **Watch for changes**: `npm run watch` (Browserify auto-rebuild)
3. **Test in browser**: http://localhost:1337
4. **Check console**: Look for errors, inspect `newBoard` object

### Accessibility (Post-MVP)
- Add focus indicators to interactive elements
- Implement keyboard grid navigation (arrow keys)
- Add ARIA live regions for status updates
- Support `prefers-reduced-motion` and `prefers-contrast: high`
- Test with screen readers (VoiceOver/NVDA)

---

## 11) AI Explanation Feature

### Architecture Boundary
```
Browser → Build Run Digest (JSON) → POST /api/explain
    ↓
Express Server → Validate digest → Build prompt → Call OpenAI API
    ↓
OpenAI API (gpt-4o-mini) → Return 3-sentence explanation
```

### Run Digest Schema
```json
{
  "algorithmKey": "dijkstra",
  "meta": {
    "algorithmFamily": "weighted",
    "guaranteesOptimal": true,
    "usesHeuristic": false,
    "selectionRule": "Always expand the node with the lowest total cost found so far."
  },
  "start": "row 10, col 5",
  "target": "row 10, col 25",
  "visitedCount": 312,
  "pathLength": 42,
  "wallCount": 50,
  "weightCount": 10,
  "visitedSample": ["row 10, col 5", "row 10, col 6", "..."],
  "pathSample": ["row 10, col 5", "...", "row 10, col 25"]
}
```

### AI Guardrails
- **Translation only**: AI must use ONLY facts from the digest
- **Exactly 3 sentences**: No more, no less
- **Feynman-simple English**: Beginner-friendly, no jargon
- **No advice**: Just describe what happened
- **Fallback**: If API fails, show deterministic text: "The algorithm visited {visitedCount} nodes and found a path of {pathLength} steps."

---

## 12) Success Criteria

After implementing MVP features, a learner should be able to:
- Answer: "Why was this node chosen?"
- Answer: "Why is this path cheaper?"
- Understand how changing weight values affects the chosen path
- Open History and replay a previous run
- Read a 3-sentence AI explanation that accurately describes what happened

---

## Glossary

- **Node**: A cell in the grid
- **Weight**: Extra cost added when entering a node
- **Cost model**: Rules for computing movement cost (base + turn + weight)
- **Trace**: Step-by-step machine-readable log of algorithm events
- **Explanation**: Human-readable text rendered from the trace
- **Run Digest**: Compact JSON summary of a completed algorithm run
- **Frontier**: Set of nodes to be explored (open set in A*)
