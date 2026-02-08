# Pathfinding Visualizer

An interactive educational tool for visualizing pathfinding algorithms with **step-by-step explanations** — understand not just *what* the algorithm does, but *why* it makes each decision.

![License](https://img.shields.io/badge/license-ISC-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

---

## ✨ Features

### Core Visualization
- 🎯 **8 Pathfinding Algorithms** — Dijkstra, A*, BFS, DFS, and more
- 🧱 **Interactive Grid** — Draw walls and weight nodes
- 🎨 **Maze Generation** — Recursive division algorithm
- ⚡ **3 Speed Modes** — Fast, Average, Slow

### Educational Tools
- 📖 **Step-by-Step Explanations** — See why each node is selected
- 🤖 **AI Explanation** — 3-5 -sentence summary after each run
- 💡 **"Why This Path?"** — Understand path cost decisions
- ⚖️ **Weight Slider** — Experiment with cost values (0-50)
- 📊 **Path Cost Display** — Compare efficiency metrics

### History & Replay
- 💾 **Run History** — Save last 5 runs in localStorage
- 🔄 **Replay** — Reload and replay previous runs
- 🗑️ **Manage** — Delete saved runs

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Pathfinding-Visualizer.git
cd Pathfinding-Visualizer

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the server
npm start
```

Open http://localhost:1337 in your browser.

### Enable AI Explanations (Optional)

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Edit `.env` file:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Restart the server

> Without an API key, the app uses fallback explanations (still works!)

---

## 📖 Usage Guide

### Basic Operation
1. **Set Start/Target** — Drag the green (start) and red (target) nodes
2. **Draw Walls** — Click and drag on empty cells
3. **Draw Weights** — Hold `W` + click (only for weighted algorithms)
4. **Choose Algorithm** — Select from the "Algorithms" dropdown
5. **Visualize!** — Click "Visualize [Algorithm]" button

### Understanding the Explanation Panel
The panel on the right shows:
- **Current Node** — Which cell is being processed
- **Cost Breakdown** — Base cost + turn penalty + weight
- **Reason** — Why this node was selected (e.g., "lowest g-cost")

### Weight Experimentation
1. Adjust the **Weight Slider** (0-50) in the navbar
2. Hold `W` and click to paint weight nodes
3. Run algorithm and observe the "Why This Path?" explanation
4. Try different weight values to see how the path changes

---

## 🧠 Algorithms

### Weighted Algorithms
| Algorithm | Optimal | Heuristic | Description |
|-----------|---------|-----------|-------------|
| **Dijkstra's** | ✅ | ❌ | The classic; guarantees shortest path |
| **A* Search** | ✅ | ✅ | Best overall; uses heuristic for speed |
| **Greedy Best-first** | ❌ | ✅ | Fast but may not find shortest path |
| **Swarm** | ❌ | ✅ | Blend of Dijkstra and A* (see below) |
| **Convergent Swarm** | ❌ | ✅ | Faster, more heuristic-heavy Swarm |
| **Bidirectional Swarm** | ❌ | ✅ | Swarm from both ends |

### Unweighted Algorithms
| Algorithm | Optimal | Description |
|-----------|---------|-------------|
| **Breadth-first Search** | ✅ | Level-by-level exploration |
| **Depth-first Search** | ❌ | Goes deep first; can find very long paths |

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | No | - | OpenAI API key for AI explanations |
| `PORT` | No | 1337 | Server port |

### Cost Model

The algorithm uses this cost formula for weighted algorithms:
```
Edge Cost = Base (1) + Turn Penalty (0-2) + Node Weight (0-50)
```

| Turn Type | Penalty |
|-----------|---------|
| Straight | +0 |
| 90° turn | +1 |
| 180° turn (backtrack) | +2 |

---

## 🔌 API Reference

### POST /api/explain

Generate AI explanation for a completed pathfinding run.

**Request Body:**
```json
{
  "algorithmKey": "dijkstra",
  "visitedCount": 846,
  "pathLength": 38,
  "wallCount": 47,
  "weightCount": 5,
  "start": "row 10, col 5",
  "target": "row 10, col 25"
}
```

**Response:**
```json
{
  "explanation": "Dijkstra's Algorithm checked 846 cells before finding...",
  "source": "ai"
}
```

> If no API key is configured, `source` will be `"fallback"`.

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Expected output:
# weightImpactAnalyzer tests passed.
```

### Manual Testing Checklist
- [ ] Grid renders correctly
- [ ] Can draw walls and weights
- [ ] All 8 algorithms run without errors
- [ ] History saves and replays correctly
- [ ] Explanation panel updates during animation

---

## 📁 Project Structure

```
Pathfinding-Visualizer/
├── index.html              # Main HTML entry point
├── server.js               # Express server + /api/explain
├── package.json            # Dependencies
├── .env.example            # Environment template
├── docs/                   # Documentation (11 files)
├── tests/                  # Unit tests
└── public/
    ├── browser/
    │   ├── board.js        # Main controller
    │   ├── node.js         # Node model
    │   ├── pathfindingAlgorithms/
    │   ├── mazeAlgorithms/
    │   ├── animations/
    │   └── utils/          # Explanation, history, metrics
    └── styling/
        └── cssBasic.css    # Main stylesheet
```

---

## 🤝 Contributing

Contributions are welcome! Please read the documentation in `/docs` folder before making changes.

---

## 📄 License

ISC License

---

## 💡 About the Swarm Algorithm

The Swarm Algorithm is an algorithm that I - at least presumably so (I was unable to find anything close to it online) - co-developed with a good friend and colleague, Hussein Farah. 

The algorithm is essentially a mixture of Dijkstra's Algorithm and A* Search; more precisely, while it converges to the target node like A*, it still explores quite a few neighboring nodes surrounding the start node like Dijkstra's. 

The algorithm differentiates itself from A* through its use of heuristics: it continually updates nodes' distance from the start node while taking into account their estimated distance from the target node. This effectively "balances" the difference in total distance between nodes closer to the start node and nodes closer to the target node, which results in the triangle-like shape of the Swarm Algorithm. 

We named the algorithm "Swarm" because one of its potential applications could be seen in a video-game where a character must keep track of a boss with high priority (the target node), all the while keeping tracking of neighboring enemies that might be swarming nearby.
