# Feature Spec — Run History (localStorage, 5-run)

## 1) Goal
Allow users to:
- View last 5 runs
- Load a run (restore grid + settings)
- Replay (re-run algorithm to animate)
- Delete runs

## 2) Design Principles
- Store **sparse** data, not full node objects.
- Store enough to reconstruct:
  - dimensions + start/target
  - walls list
  - weights list (+ numeric value)
  - settings (algo, speed, cost model)
  - result summary (optional)

## 3) Storage Schema (KISS)
Key: `pfv:runs:v1`

```json
{
  "id": "run_1700000000",
  "ts": 1700000000000,
  "name": "Dijkstra — demo 1",
  "grid": {
    "height": 22,
    "width": 60,
    "start": "10-5",
    "target": "10-40",
    "walls": ["3-4", "3-5"],
    "weights": [{"id": "8-9", "w": 15}]
  },
  "algo": "dijkstra",
  "speed": "average",
  "weightValue": 15,
  "result": { "found": true, "pathCost": 123, "visited": 800 }
}
```

> **Removed:** `heuristic`, `costModel` object. We use existing algorithm behavior, just store which algo was selected.

## 4) Operations
- Save run: `unshift` + cap 5
- Load list: render menu
- Load run: rebuild board state then render
- Replay: run algorithm again (do not store per-frame)
- Delete: remove by id

## 5) UI Spec
- History button on navbar
- Dropdown/list:
  - line 1: name
  - line 2: time + algo + summary (cost/pathLen)
  - actions: Load / Replay / Delete

## 6) Edge Cases (MVP: Keep Simple)
- **Viewport mismatch:** Rebuild grid with stored dimensions (don't try to scale)
- **localStorage full:** Cap at 5 runs, show console warning if save fails
- **Corrupt data:** Catch JSON parse errors, clear bad entries

## 7) Acceptance Criteria
- After Visualize completes, run is saved to History
- Refresh page → History list still shows runs
- Load restores grid (walls, weights, start, target)
- User clicks Visualize to replay

## 8) Out of Scope (MVP)
- Rename runs
- Export/import history
- Cloud sync
