/**
 * Calculate grid metrics for Feynman explanations
 *
 * @param {Object} board - Board instance
 * @returns {Object} metrics
 */
function calculateGridMetrics(board) {
  var nodes = board && board.nodes ? board.nodes : {};
  var nodeIds = Object.keys(nodes);
  var gridSize = nodeIds.length;

  var wallCount = 0;
  var weightCount = 0;
  var totalWeightValue = 0;

  for (var i = 0; i < nodeIds.length; i++) {
    var node = nodes[nodeIds[i]];
    if (!node) continue;
    if (node.status === "wall") {
      wallCount++;
    }
    if (node.weight > 0) {
      weightCount++;
      totalWeightValue += node.weight;
    }
  }

  var startCoords = parseCoords(board && board.start);
  var targetCoords = parseCoords(board && board.target);
  var directDistance = Math.abs(startCoords[0] - targetCoords[0]) +
    Math.abs(startCoords[1] - targetCoords[1]);

  var pathLength = computePathLengthFromBoard(board);
  var detourSteps = pathLength > 0 ? Math.max(0, pathLength - directDistance) : 0;
  var efficiency = pathLength > 0 && directDistance > 0 ? directDistance / pathLength : 1;

  var visitedCount = 0;
  if (board) {
    if (typeof board.lastVisitedCount === "number" && board.lastVisitedCount > 0) {
      visitedCount = board.lastVisitedCount;
    } else if (board.nodesToAnimate && board.nodesToAnimate.length) {
      visitedCount = board.nodesToAnimate.length;
    }
  }

  var visitedPercent = gridSize > 0 ? Math.round((visitedCount / gridSize) * 100) : 0;
  var wallDensity = gridSize > 0 ? wallCount / gridSize : 0;
  var wallDensityLevel = wallDensity < 0.1 ? "low" :
    wallDensity < 0.25 ? "medium" : "high";

  return {
    gridSize: gridSize,
    wallCount: wallCount,
    weightCount: weightCount,
    totalWeightValue: totalWeightValue,
    directDistance: directDistance,
    pathLength: pathLength,
    efficiency: efficiency,
    detourSteps: detourSteps,
    visitedCount: visitedCount,
    visitedPercent: visitedPercent,
    wallDensityLevel: wallDensityLevel
  };
}

function parseCoords(id) {
  if (!id || typeof id !== "string") return [0, 0];
  var parts = id.split("-");
  var row = parseInt(parts[0], 10);
  var col = parseInt(parts[1], 10);
  return [isNaN(row) ? 0 : row, isNaN(col) ? 0 : col];
}

function computePathLengthFromBoard(board) {
  if (!board) return 0;

  if (board.shortestPathNodesToAnimate && board.shortestPathNodesToAnimate.length) {
    var pathLength = board.shortestPathNodesToAnimate.length;
    var includesStart = false;
    var includesTarget = false;

    for (var i = 0; i < board.shortestPathNodesToAnimate.length; i++) {
      var node = board.shortestPathNodesToAnimate[i];
      if (!node) continue;
      if (node.id === board.start) includesStart = true;
      if (node.id === board.target) includesTarget = true;
    }

    if (!includesStart) pathLength++;
    if (!includesTarget) pathLength++;

    return pathLength;
  }

  if (typeof board.computePathCost === "function") {
    var metrics = board.computePathCost();
    if (metrics && typeof metrics.pathLength === "number") {
      return metrics.pathLength;
    }
  }

  return 0;
}

module.exports = { calculateGridMetrics: calculateGridMetrics };
