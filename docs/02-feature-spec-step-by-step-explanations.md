# Feature Spec — Step-by-step Reasoning & Explanations

## 1) Problem (Feynman)
Animation is like watching a robot move, but you can’t hear the robot’s thoughts.
We want learners to see:
- Which node is selected and why
- How the frontier/open set changes
- How costs are updated (especially with weights / turn penalty)

## 2) Approach
Separate into two layers:
1) **Trace layer (truth):** the algorithm produces a precise, machine-readable event log.
2) **Explanation layer (presentation):** UI renders the log into text + highlights.

> AI (post-run summary): only used to **rephrase** trace into friendly language, never to infer logic.

## 3) Trace Event Schema (MVP)

### Core event types (MVP — keep it simple)
- `select_current` — which node we're processing now
- `relax_neighbor` — cost improved, update distance
- `skip_neighbor` — wall / visited / no improvement
- `found_target` — done, path exists
- `no_path` — done, no path

> **YAGNI:** `consider_neighbor`, `enqueue_frontier`, `dequeue_frontier`, `mark_visited` can be added later if needed.

### Example payloads

#### select_current
```json
{
  "t": "select_current",
  "step": 12,
  "current": "10-15",
  "reason": "min_distance",
  "metrics": { "frontierSize": 38, "visitedCount": 120 },
  "values": { "g": 27, "h": 0, "f": 27 }
}
```

#### relax_neighbor
```json
{
  "t": "relax_neighbor",
  "step": 13,
  "from": "10-15",
  "to": "10-16",
  "old": { "g": 40 },
  "new": { "g": 29 },
  "components": { "base": 1, "turnPenalty": 2, "weight": 0 },
  "why": "new_cost_lower"
}
```

## 4) Explanation Templates (No-AI MVP)
- `select_current`: “Select (r,c) because it has the smallest cost in the frontier.”
- `relax_neighbor`: “Update (r,c): g 40 → 29 = base 1 + turn 2 + weight 0.”
- `skip_neighbor`: “Skip (r,c) because it’s a wall / visited / cost is not better.”

## 5) UI Spec (MVP — Keep Simple)

### Explanation Panel (Right Sidebar)
- **Header:** Algorithm name
- **Current step:** "Processing node (5,10) — distance: 27"
- **Last action:** "Updated (5,11): 35 → 29 (base 1 + turn 2 + weight 0)"
- **Toggle:** Checkbox to show/hide panel

> **KISS:** No pause/step controls in MVP. No jump buttons. No frontier highlighting. Just show text that matches the animation.

## 6) Integration Points
- Algorithms should call `trace.push(event)` at key moments.
- Animation can:
  - remain driven by `nodesToAnimate`, and trace runs in parallel, or
  - be driven directly from trace (later refactor).

## 7) Acceptance Criteria (MVP)
- Panel shows current node being processed
- Panel shows cost breakdown when a neighbor is updated
- Toggle hides the panel without breaking animation
- Works for Dijkstra and A* (BFS/DFS: simpler text, no costs)

## 8) Out of Scope (MVP)
- AI narration (live, step-by-step during animation) — Phase 2
- Pause/step controls
- Trace export to file

---

## 9) AI Explanation Feature — Post-run (After Animation)

> **This is separate from the step-by-step sidebar.** The sidebar shows live trace; this shows a 3-sentence summary after the run completes.

### 9.1) Flow

```
User clicks Visualize
    → Algorithm runs
    → Visited animation plays
    → Shortest path animation plays
    → board.toggleButtons() called (animation complete)
    → IF success:
        → Build Run Digest (small JSON)
        → POST /api/explain
        → Render 3-sentence explanation in #ai-explanation
```

### 9.2) Run Digest Schema

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
  "pathSample": ["row 10, col 5", "row 10, col 6", "row 10, col 7", "...", "row 10, col 23", "row 10, col 24", "row 10, col 25"]
}
```

| Field | Description |
|-------|-------------|
| `algorithmKey` | Algorithm identifier (e.g., "dijkstra", "astar", "bfs") |
| `meta.algorithmFamily` | "weighted" or "unweighted" |
| `meta.guaranteesOptimal` | true for Dijkstra/A*/BFS, false for DFS/Greedy |
| `meta.usesHeuristic` | true for A*/Greedy |
| `meta.selectionRule` | 1-sentence rule for node selection priority |
| `visitedSample` | First 8 visited nodes (format: "row X, col Y") |
| `pathSample` | First 3 + last 3 nodes of shortest path |

### 9.3) AI Guardrails

- **Translation only:** AI must use ONLY facts from the digest. No invented numbers or steps.
- **Exactly 3 sentences:** Output must be exactly 3 sentences, no more, no less.
- **Feynman-simple English:** Beginner-friendly, no jargon (no "heuristic", "priority queue", etc.).
- **No advice:** Do not give tips or suggestions. Just describe what happened.

### 9.4) UX Spec

| Element | Spec |
|---------|------|
| **Container** | `<div id="ai-explanation"></div>` below grid |
| **Loading state** | "Generating explanation..." or spinner |
| **Success** | Display 3-sentence explanation |
| **AI failure fallback** | "The algorithm visited {visitedCount} nodes and found a path of {pathLength} steps." |
| **No-path runs** | Hide or clear the explanation box (no explanation) |

### 9.5) Out of Scope for AI Explanation Feature

- Storing AI explanation text in History (later enhancement)
- Step-by-step AI narration during animation (Phase 2)
