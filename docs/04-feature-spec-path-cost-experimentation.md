# Feature Spec — Path Cost Experimentation (Beyond fixed weight=15)

## 1) Problem (Feynman)
If weight is always 15, learners only see “one kind of bad road.”
True experimentation means changing cost values and observing how decisions change.

## 2) MVP Capabilities
- User can choose a numeric weight value (slider/input)
- Painting weights assigns that numeric value
- Algorithms treat weight as numeric (no hardcoded 15 assumptions)
- UI shows run summary: total path cost, visited nodes, path length

## 3) Cost Model (Keep Existing Logic)

**MVP: Don't change the cost calculation formula.** Just make weight configurable.

Current behavior (keep as-is):
- Base move: 1
- Turn penalty: calculated by existing `getDistance()` function
- Weight: `node.weight` (was hardcoded 15, now user-configurable 0-50)

```js
// Edge cost = getDistance(from, to)[0] + to.weight
// getDistance already handles turn penalty internally
```

> **KISS:** Don't add new costModel config object. Just fix the hardcoded `weight === 15` checks.

## 4) UI Spec (MVP)

### Weight Slider
- Label: "Weight: 15" (updates as slider moves)
- Range: 0–50, default 15
- Location: navbar area

### Interaction
- Keep existing "hold W + click" to paint weights
- Painted weight uses current slider value

### Run Summary (after Visualize completes)
- Show: "Path cost: 123 | Visited: 800 nodes"
- Location: below grid or in explanation panel

## 5) Algorithm Requirements
- Weighted algorithms must treat `node.weight` as numeric
- Remove logic like `weight === 15 ? 15 : 1`
- Ensure clearing path doesn’t wipe weights unless user clears board

## 6) Acceptance Criteria
- Changing weight value changes the chosen path or total cost
- Running same grid with weight=5 vs weight=30 yields noticeably different outcomes
- No crashes caused by assumptions about weight=15

## 7) Out of Scope (MVP)
- Compare mode
- Diagonal movement
- Preset terrains (Sand/Water/Swamp)
