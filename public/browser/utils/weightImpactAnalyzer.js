/**
 * Analyze weight impact on path decisions
 *
 * Input:
 *   - board: Board instance with completed algorithm
 *
 * Output:
 *   - { weightNodesInPath, totalWeightCost, baseCost, turnPenaltyCost, explanation }
 */
function analyzeWeightImpact(board) {
  var result = {
    weightNodesInPath: [],
    totalWeightCost: 0,
    baseCost: 0,
    turnPenaltyCost: 0,
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

  if (result.weightNodesInPath.length === 0) {
    result.explanation = "The path goes only through normal nodes. " +
      "Total cost is " + result.baseCost + " from base movement.";
  } else {
    result.explanation = "The path goes through " +
      result.weightNodesInPath.length + " weight node(s), adding " +
      result.totalWeightCost + " extra cost. " +
      "The algorithm chose this because going around would cost more.";
  }

  return result;
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
