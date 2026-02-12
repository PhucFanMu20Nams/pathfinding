var descriptions = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    shortDescription: "Finds the shortest path by always expanding the cheapest unvisited node.",
    category: "weighted",
    guaranteesOptimal: true,
    howItWorks: [
      "1. Set start distance = 0, all others = infinity",
      "2. Pick the unvisited node with the smallest distance",
      "3. Update neighbors if a cheaper path is found",
      "4. Mark the current node as visited",
      "5. Repeat until the target is reached or nodes run out"
    ],
    pseudocode: [
      "dist[start] = 0",
      "while unvisited not empty:",
      "  current = node with MIN dist",
      "  if current == target: DONE",
      "  for each neighbor:",
      "    newCost = dist[current] + edgeCost",
      "    if newCost < dist[neighbor]:",
      "      dist[neighbor] = newCost",
      "      neighbor.prev = current"
    ],
    keyInsight: "Expanding the cheapest node first guarantees the shortest path.",
    characteristics: {
      dataStructure: "Priority queue (current implementation uses a linear scan)",
      timeComplexity: "O(V^2) with array, O((V+E) log V) with heap",
      usesHeuristic: false,
      selectionRule: "Pick the node with the smallest g(n)"
    }
  },
  astar: {
    name: "A* Search",
    shortDescription: "Combines real cost so far with a heuristic estimate to guide the search.",
    category: "weighted",
    guaranteesOptimal: true,
    howItWorks: [
      "1. Set start cost = 0 and heuristic estimate to target",
      "2. Pick the node with the lowest f = g + h",
      "3. Update neighbors if a cheaper path is found",
      "4. Mark the current node as visited",
      "5. Repeat until the target is reached"
    ],
    pseudocode: [
      "g[start] = 0",
      "f[start] = h(start)",
      "while open not empty:",
      "  current = node with MIN f",
      "  if current == target: DONE",
      "  for each neighbor:",
      "    gNew = g[current] + edgeCost",
      "    if gNew < g[neighbor]:",
      "      g[neighbor] = gNew",
      "      f[neighbor] = gNew + h(neighbor)",
      "      neighbor.prev = current"
    ],
    keyInsight: "A* stays optimal when the heuristic never overestimates.",
    characteristics: {
      dataStructure: "Priority queue (open set)",
      timeComplexity: "O((V+E) log V) with heap",
      usesHeuristic: true,
      selectionRule: "Pick the node with the smallest f(n) = g(n) + h(n)"
    }
  },
  greedy: {
    name: "Greedy Best-first Search",
    shortDescription: "Prioritizes nodes that look closest to the target using only h(n).",
    category: "weighted",
    guaranteesOptimal: false,
    howItWorks: [
      "1. Compute heuristic h for nodes",
      "2. Pick the node with the smallest h",
      "3. Expand neighbors and repeat",
      "4. Stop when target is reached"
    ],
    pseudocode: [
      "while open not empty:",
      "  current = node with MIN h",
      "  if current == target: DONE",
      "  add neighbors to open",
      "  mark current visited"
    ],
    keyInsight: "Fast, but can miss the shortest path because it ignores g(n).",
    characteristics: {
      dataStructure: "Priority queue (open set)",
      timeComplexity: "O((V+E) log V) typical",
      usesHeuristic: true,
      selectionRule: "Pick the node with the smallest h(n)"
    }
  },
  swarm: {
    name: "Swarm Algorithm",
    shortDescription: "Blends distance so far with a heuristic to guide the search.",
    category: "weighted",
    guaranteesOptimal: false,
    howItWorks: [
      "1. Compute a combined score from g and h",
      "2. Pick the node with the smallest score",
      "3. Relax neighbors and repeat",
      "4. Stop when target is reached"
    ],
    pseudocode: [
      "score = g + h",
      "while open not empty:",
      "  current = node with MIN score",
      "  if current == target: DONE",
      "  relax neighbors",
      "  mark current visited"
    ],
    keyInsight: "Balances speed and path quality but does not guarantee optimal.",
    characteristics: {
      dataStructure: "Priority queue (open set)",
      timeComplexity: "O((V+E) log V) typical",
      usesHeuristic: true,
      selectionRule: "Pick the node with the smallest blended score"
    }
  },
  convergentSwarm: {
    name: "Convergent Swarm Algorithm",
    shortDescription: "Uses an aggressive heuristic (h^7) to rush toward the target.",
    category: "weighted",
    guaranteesOptimal: false,
    howItWorks: [
      "1. Use a heavily powered heuristic (h^7)",
      "2. Pick the node with the smallest combined score",
      "3. Relax neighbors and repeat quickly toward target"
    ],
    pseudocode: [
      "score = g + h^7",
      "while open not empty:",
      "  current = node with MIN score",
      "  if current == target: DONE",
      "  relax neighbors"
    ],
    keyInsight: "Very fast but can skip better paths due to extreme heuristic bias.",
    characteristics: {
      dataStructure: "Priority queue (open set)",
      timeComplexity: "O((V+E) log V) typical",
      usesHeuristic: true,
      selectionRule: "Pick the node with the smallest g + h^7"
    }
  },
  bidirectional: {
    name: "Bidirectional Swarm Algorithm",
    shortDescription: "Runs two searches from start and target until they meet.",
    category: "weighted",
    guaranteesOptimal: false,
    howItWorks: [
      "1. Start one search from start and one from target",
      "2. Expand nodes from both sides",
      "3. Stop when the frontiers meet"
    ],
    pseudocode: [
      "frontA = {start}, frontB = {target}",
      "while frontA and frontB not empty:",
      "  expand one step from each side",
      "  if frontiers meet: DONE"
    ],
    keyInsight: "Can be faster in open grids but is not guaranteed optimal here.",
    characteristics: {
      dataStructure: "Two frontiers (priority queues)",
      timeComplexity: "Often faster than single-source in practice",
      usesHeuristic: true,
      selectionRule: "Expand from both sides with heuristic guidance"
    }
  },
  bfs: {
    name: "Breadth-first Search",
    shortDescription: "Explores level-by-level from the start using a queue.",
    category: "unweighted",
    guaranteesOptimal: true,
    howItWorks: [
      "1. Put the start node in a queue",
      "2. Pop from the front and expand neighbors",
      "3. Push unvisited neighbors to the back",
      "4. Repeat until target is found"
    ],
    pseudocode: [
      "queue = [start]",
      "while queue not empty:",
      "  current = queue.shift()",
      "  if current == target: DONE",
      "  for each neighbor:",
      "    if unvisited: queue.push(neighbor)"
    ],
    keyInsight: "The first time you reach a node is the shortest path in unweighted grids.",
    characteristics: {
      dataStructure: "Queue",
      timeComplexity: "O(V+E)",
      usesHeuristic: false,
      selectionRule: "FIFO (first-in, first-out)"
    }
  },
  dfs: {
    name: "Depth-first Search",
    shortDescription: "Dives deep along one path before backtracking.",
    category: "unweighted",
    guaranteesOptimal: false,
    howItWorks: [
      "1. Push the start node onto a stack",
      "2. Pop the top node and expand a neighbor",
      "3. Keep going deep until stuck, then backtrack"
    ],
    pseudocode: [
      "stack = [start]",
      "while stack not empty:",
      "  current = stack.pop()",
      "  if current == target: DONE",
      "  for each neighbor:",
      "    if unvisited: stack.push(neighbor)"
    ],
    keyInsight: "DFS is fast but can take long detours and is not optimal.",
    characteristics: {
      dataStructure: "Stack",
      timeComplexity: "O(V+E)",
      usesHeuristic: false,
      selectionRule: "LIFO (last-in, first-out)"
    }
  }
};

function getAlgorithmKey(algorithm, heuristic) {
  if (algorithm === "CLA") {
    if (heuristic === "extraPoweredManhattanDistance") return "convergentSwarm";
    return "swarm";
  }
  return algorithm;
}

module.exports = { descriptions: descriptions, getAlgorithmKey: getAlgorithmKey };
