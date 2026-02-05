# 3-Day Implementation Roadmap
## Interactive Pathfinding Visualizer Enhancements

### Scope
This roadmap covers **only**:
1. Step-by-step reasoning / explanations
2. Run history using localStorage (revisit & replay)
3. Path cost experimentation beyond fixed weight=15

**No framework migration, no backend rewrite. Reuse existing Express server for required AI explanation endpoint (`/api/explain`).**

---

## Day 1 — Foundations: Cost Model & History (Low Risk, High Impact)

### Goal
Establish the data and cost foundations to enable experimentation and persistence.

### Tasks

#### 1) Path Cost Experimentation (MVP)
- Add a UI control for numeric weight value (e.g., slider 0–50; default 15)
- Update weight painting to assign the selected numeric value
- Remove any algorithm logic that assumes `weight === 15`
- Ensure total path cost is computed correctly

**Deliverables**
- User can change weight value and see different outcomes
- Path total cost is shown (or at least computed for summary)

#### 2) Run Summary + Serialization
- Implement a serializer that extracts:
  - grid dims
  - start/target
  - walls list
  - weights list (id + value)
  - settings (algo, speed, cost model settings)
  - result summary (found, pathLen, pathCost, visited)

**Deliverables**
- One JS object fully representing a run (loggable in console)

#### 3) localStorage History (Core Logic)
- Implement:
  - `saveRun(run)` (unshift + cap 5)
  - `loadRuns()`
  - `deleteRun(id)`
- Store under a versioned key (e.g., `pfv:runs:v1`)

**Deliverables**
- Runs persist across refresh
- Always stores max 5 runs

---

## Day 2 — Step-by-Step Reasoning (Core Differentiator)

### Goal
Make the algorithm’s decisions observable and explainable.

### Tasks

#### 1) Trace Collector (Algorithm-Level)
- Add a `trace` array passed into algorithms
- Push structured events at key moments (MVP subset):
  - `select_current`
  - `relax_neighbor`
  - `skip_neighbor`
  - `found_target` / `no_path`

**Deliverables**
- Each run produces a deterministic trace array

#### 2) Explanation Templates (No AI)
- Map trace events → short human-readable text
- For Dijkstra/A*: include g/h/f values
- For BFS/DFS: simpler "FIFO" or "LIFO" text

**Deliverables**
- Explanations always match trace numbers (no guessing)

#### 3) Minimal Explanation Panel UI
- Right sidebar:
  - current step text
  - current node id + (g/h/f where relevant)
  - neighbor updates list
- Toggle: Explain ON/OFF

**Deliverables**
- Explanations render live during animation
- Turning OFF explanations keeps existing visualizer behavior

---

## Day 3 — Integration, Replay, AI Explanation & Polish

### Goal
Make features usable, coherent, and demo-ready. Add post-run AI explanation.

### Tasks

#### 1) AI Explanation Feature: Post-run

- Add `<div id="ai-explanation"></div>` below grid in `index.html`
- Implement `POST /api/explain` endpoint in `server.js`:
  - Read `OPENAI_API_KEY` from env
  - Build prompt with guardrails (3 sentences, Feynman-simple, translation-only)
  - Call OpenAI Responses API
  - Return `{ explanation: "..." }`
- Build Run Digest in browser after animation completes:
  - Trigger point: after `board.toggleButtons()` in `drawShortestPathTimeout()`
  - Condition: `success`
  - Collect: algorithmKey, start/target, visitedCount, pathLength, samples, meta
- Render explanation or fallback text
- Add loading state ("Generating explanation...")

**Deliverables**
- Successful runs show 3-sentence AI explanation below grid
- API failure shows fallback text

#### 2) History UI
- Add History button/menu
- Display last 5 runs:
  - name
  - timestamp
  - algo + summary (pathCost/pathLen/visited)
- Actions:
  - Load
  - Replay
  - Delete

**Deliverables**
- User can pick a run and restore it

#### 3) Replay Integration
- On replay:
  - rebuild grid from stored sparse data
  - apply settings
  - re-run algorithm (do NOT replay stored frames)

**Deliverables**
- Replay behaves like original run
- No state corruption

#### 4) Final Verification + Cleanup
- Verify:
  - weight experimentation changes decisions / costs
  - history survives refresh
  - explanations match trace exactly
- Add comments to non-obvious logic

**Deliverables**
- Demo-ready build
- Incremental changes (no rewrite)

---

## End State (After 3 Days)
- The visualizer is no longer a “black box”.
- Users can experiment with costs meaningfully.
- Users can revisit and replay learning sessions.
- **Successful runs get a friendly 3-sentence AI explanation (no jargon).**
- Codebase remains framework-agnostic and familiar.
