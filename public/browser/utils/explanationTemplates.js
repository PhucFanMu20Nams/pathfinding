function generateExplanation(event, algorithmKey) {
  var templates = {
    select_current: function (e) {
      var coords = idToCoords(e.current);
      var algoContext = "";
      if (algorithmKey === "dijkstra") {
        algoContext = " Dijkstra always picks the cheapest unvisited node — this guarantees the optimal path.";
      } else if (algorithmKey === "astar") {
        algoContext = " A* combines actual cost g(n) with estimated distance h(n) to prioritize nodes likely on the shortest path.";
      } else if (algorithmKey === "greedy") {
        algoContext = " Greedy only looks at h(n) — fast but can miss shorter paths.";
      } else if (algorithmKey === "swarm") {
        algoContext = " Swarm blends g(n) and h(n) with moderate bias toward the target.";
      } else if (algorithmKey === "convergentSwarm") {
        algoContext = " Convergent Swarm uses an extremely aggressive heuristic (h^7) to rush toward the target.";
      } else if (algorithmKey === "bfs") {
        algoContext = " BFS explores level-by-level from start, guaranteeing the shortest path in unweighted grids.";
      } else if (algorithmKey === "dfs") {
        algoContext = " DFS dives as deep as possible before backtracking — fast but does not guarantee shortest path.";
      } else if (algorithmKey === "bidirectional") {
        algoContext = " Bidirectional search runs two simultaneous explorations from start and target.";
      }
      if (e.reason === "min_distance") {
        return "Selected node " + coords + " because it has the lowest distance from start (g=" + e.values.g + ")." + algoContext;
      } else if (e.reason === "min_total_distance") {
        return "Selected node " + coords + " because it has the lowest total cost (f=" + e.values.f + " = g:" + e.values.g + " + h:" + e.values.h + ")." + algoContext;
      } else if (e.reason === "fifo_queue") {
        return "Selected node " + coords + " from the front of the queue (BFS explores level-by-level)." + algoContext;
      } else if (e.reason === "lifo_stack") {
        return "Selected node " + coords + " from the top of the stack (DFS explores depth-first)." + algoContext;
      }
      return "Selected node " + coords + "." + algoContext;
    },

    evaluating_neighbors: function (e) {
      var coords = idToCoords(e.current);
      return "Checking " + e.neighborCount + " neighbors of " + coords + ".";
    },

    relax_neighbor: function (e) {
      var fromCoords = idToCoords(e.from);
      var toCoords = idToCoords(e.to);
      var costBreakdown = "base=" + e.components.base;
      if (e.components.turnPenalty > 0) {
        costBreakdown += " + turn=" + e.components.turnPenalty;
      }
      if (e.components.weight > 0) {
        costBreakdown += " + weight=" + e.components.weight;
      }
      var relaxContext = "";
      if (algorithmKey === "astar") {
        relaxContext = " A* also updates f = g + h, so nodes closer to the target get higher priority.";
      } else if (algorithmKey === "dijkstra") {
        relaxContext = " Dijkstra updates only g (actual cost) — no heuristic involved.";
      }
      return "Found a cheaper route to " + toCoords + " through " + fromCoords + "! New cost: " + e.new.g + " (" + costBreakdown + "). Was: " + e.old.g + "." + relaxContext;
    },

    skip_neighbor: function (e) {
      var toCoords = idToCoords(e.to);
      if (e.reason === "wall") {
        return "Skipped " + toCoords + " because it's a wall.";
      } else if (e.reason === "visited") {
        return "Skipped " + toCoords + " because it's already visited.";
      } else if (e.reason === "no_improvement") {
        return "Skipped " + toCoords + " because the new cost is not better.";
      }
      return "Skipped " + toCoords + ".";
    },

    found_target: function (e) {
      var coords = idToCoords(e.target);
      var visitedCount = e.metrics && e.metrics.visitedCount !== undefined && e.metrics.visitedCount !== null ?
        e.metrics.visitedCount : "—";
      var pathCost = e.metrics && e.metrics.pathCost !== undefined && e.metrics.pathCost !== null ?
        e.metrics.pathCost : "—";
      return "Target " + coords + " reached! Visited " + visitedCount + " nodes. Total path cost: " + pathCost + ".";
    },

    no_path: function (e) {
      return "No path found. The frontier was exhausted without reaching the target.";
    },

    found_midpoint: function (e) {
      var coords = idToCoords(e.midpoint);
      return "Both searches met at " + coords + "! Combining paths.";
    }
  };

  var handler = templates[event.t];
  return handler ? handler(event) : "Step " + event.step;
}

function idToCoords(id) {
  var parts = id.split("-");
  return "(" + parts[0] + "," + parts[1] + ")";
}

module.exports = { generateExplanation: generateExplanation };
