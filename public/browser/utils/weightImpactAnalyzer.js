const gridMetrics = require("./gridMetrics");

/**
 * Analyze weight impact on path decisions
 *
 * Input:
 *   - board: Board instance with completed algorithm
 *
 * Output:
 *   - { weightNodesInPath, totalWeightCost, baseCost, turnPenaltyCost, metrics, explanation }
 */
function analyzeWeightImpact(board) {
  var metrics = gridMetrics.calculateGridMetrics(board);
  var result = {
    weightNodesInPath: [],
    totalWeightCost: 0,
    baseCost: 0,
    turnPenaltyCost: 0,
    metrics: metrics,
    explanation: ""
  };

  var path = reconstructPath(board);
  if (!path.length) {
    result.explanation = "No path found, so there is no cost to explain.";
    return result;
  }

  for (var i = 0; i < path.length; i++) {
    var nodeId = path[i];
    var node = board.nodes[nodeId];
    if (node && node.weight > 0) {
      result.weightNodesInPath.push(nodeId);
      result.totalWeightCost += node.weight;
    }
    result.baseCost += 1;
  }

  result.explanation = generateDetailedExplanation(
    result.weightNodesInPath,
    result.totalWeightCost,
    result.baseCost,
    metrics
  );

  return result;
}

function generateDetailedExplanation(weightNodes, weightCost, baseCost, metrics) {
  var lines = [];
  var pathLength = metrics.pathLength || baseCost;
  var directDistance = metrics.directDistance || 0;
  var detourSteps = metrics.detourSteps || 0;

  if (directDistance > 0 && pathLength > 0) {
    if (directDistance === pathLength) {
      lines.push("The path takes " + pathLength + " steps, which is the straight-line distance. " +
        "This is the shortest possible route.");
    } else {
      lines.push("The path takes " + pathLength + " steps; a straight line would take " +
        directDistance + " steps.");
    }
  } else {
    lines.push("The path takes " + pathLength + " steps.");
  }

  if (detourSteps > 0) {
    if (metrics.wallCount > 0) {
      lines.push("The extra " + detourSteps + " steps are detours around " +
        metrics.wallCount + " wall(s) blocking the direct path.");
    } else if (weightNodes.length > 0) {
      lines.push("The path is longer to balance distance and weight cost.");
    } else {
      lines.push("The path is longer than the straight-line distance due to the search order.");
    }
  } else {
    lines.push("There are no detours beyond the straight-line distance.");
  }

  if (weightNodes.length === 0 && metrics.weightCount > 0) {
    lines.push("The path avoids all " + metrics.weightCount + " weight node(s) on the grid.");
  } else if (weightNodes.length > 0) {
    lines.push("The path crosses " + weightNodes.length + " weight node(s), adding " +
      weightCost + " extra cost.");
  } else {
    lines.push("There are no weight nodes, so cost is just steps.");
  }

  if (metrics.wallCount > 0 && detourSteps > 0) {
    lines.push("If there were no walls, the path would be " + detourSteps +
      " steps shorter.");
  } else if (weightNodes.length === 0 && metrics.weightCount > 0) {
    var avgWeight = metrics.weightCount > 0 ? Math.round(metrics.totalWeightValue / metrics.weightCount) : 0;
    lines.push("If the path went through weights, it would cost about " +
      (metrics.weightCount * avgWeight) + " more even if shorter.");
  } else if (weightNodes.length > 0) {
    lines.push("If the path avoided those weights, it would add about " +
      estimateDetourCost(weightNodes) + " extra steps.");
  } else {
    lines.push("If the start and target were closer, the path would be shorter.");
  }

  var effPercent = Math.round((metrics.efficiency || 1) * 100);
  if (effPercent >= 95) {
    lines.push("Path efficiency: " + effPercent + "% — nearly optimal.");
  } else if (effPercent >= 70) {
    lines.push("Path efficiency: " + effPercent + "% — good route given obstacles.");
  } else {
    lines.push("Path efficiency: " + effPercent + "% — significant detours were required.");
  }

  return lines.join("\n");
}

function estimateDetourCost(weightNodes) {
  return weightNodes.length * 3;
}

function reconstructPath(board) {
  if (board.shortestPathNodesToAnimate && board.shortestPathNodesToAnimate.length) {
    var pathFromNodes = board.shortestPathNodesToAnimate.map(function (node) {
      return node.id;
    });
    if (board.start && pathFromNodes[0] !== board.start) {
      pathFromNodes.unshift(board.start);
    }
    if (board.target && pathFromNodes[pathFromNodes.length - 1] !== board.target) {
      pathFromNodes.push(board.target);
    }
    return pathFromNodes;
  }

  var path = [];
  var currentId = board.target;
  while (currentId && currentId !== board.start) {
    path.unshift(currentId);
    currentId = board.nodes[currentId].previousNode;
  }
  if (currentId === board.start) {
    path.unshift(board.start);
  }
  return path;
}

module.exports = { analyzeWeightImpact: analyzeWeightImpact };
