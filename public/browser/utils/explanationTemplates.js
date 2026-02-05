function generateExplanation(event) {
  var templates = {
    select_current: function (e) {
      var coords = idToCoords(e.current);
      if (e.reason === "min_distance") {
        return "Selected node " + coords + " because it has the lowest distance from start (g=" + e.values.g + ").";
      } else if (e.reason === "min_total_distance") {
        return "Selected node " + coords + " because it has the lowest total cost (f=" + e.values.f + " = g:" + e.values.g + " + h:" + e.values.h + ").";
      } else if (e.reason === "fifo_queue") {
        return "Selected node " + coords + " from the front of the queue (BFS explores level-by-level).";
      } else if (e.reason === "lifo_stack") {
        return "Selected node " + coords + " from the top of the stack (DFS explores depth-first).";
      }
      return "Selected node " + coords + ".";
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
      return "Found shorter path to " + toCoords + " via " + fromCoords + ". New cost: " + e.new.g + " (" + costBreakdown + "). Old cost: " + e.old.g + ".";
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
