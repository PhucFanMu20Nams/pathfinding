# Interactive Pathfinding Visualizer — Context & Vision

## Context
This project is a browser-based pathfinding visualizer on a 2D grid. Users can configure a map (start/target, walls, weights) and watch algorithms run.

The key improvement we’re building is: **not only show animation**, but also **explain why the algorithm makes each decision**.

## Vision
Build a learning tool where users can:
- See what the algorithm does
- Understand why it does it (costs / heuristics / choices)
- Experiment with different costs and obstacles and predict outcomes
- Revisit and replay recent runs

## Scope (Target Release)
### Must-have (3 core problems)
1. Step-by-step reasoning / explanations
2. Run history (5 runs) saved in localStorage + replay
3. Path cost experimentation beyond fixed weight=15

### Must-have (continued)
4. Post-run AI explanation (3-sentence summary after animation completes)

### Nice-to-have (after MVP)
- Play/Pause/Step mode (instead of autoplay only)
- Compare mode (same grid, different cost settings)
- Live AI narration (step-by-step during animation)

## Non-goals (MVP)
- Backend database / user accounts / persistent storage
- Collaboration / realtime multi-user
- Perfect performance on extremely large grids (optimize "enough")

> **Note:** MVP uses Express for static serving and a lightweight `/api/explain` endpoint (AI explanation). No database required — all state lives in browser localStorage.

## Success Criteria
- After a run, a learner can answer: “Why was this node chosen?” “Why is this path cheaper?”
- Changing weight values changes the chosen path in an understandable way
- A user can open History and replay a previous run

## Glossary
- **Node**: a cell in the grid
- **Weight**: extra cost added when entering a node
- **Cost model**: rules for computing movement cost (base + turn + weight + ...)
- **Trace**: step-by-step machine-readable log of algorithm events
- **Explanation**: human-readable text rendered from the trace
