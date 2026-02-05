const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");

function launchInstantAnimations(board, success, type) {
  let nodes = board.nodesToAnimate.slice(0);
  let shortestNodes;
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) {
      change(nodes[i]);
    } else {
      change(nodes[i], nodes[i - 1]);
    }
  }
  board.nodesToAnimate = [];
  if (success) {
    board.drawShortestPath(board.target, board.start);
    shortestNodes = board.shortestPathNodesToAnimate;
  } else {
    console.log("Failure");
    board.reset();
    return;
  }

  let j;
  for (j = 0; j < shortestNodes.length; j++) {
    if (j === 0) {
      shortestPathChange(shortestNodes[j]);
    } else {
      shortestPathChange(shortestNodes[j], shortestNodes[j - 1]);
    }
  }
  board.reset();
  shortestPathChange(board.nodes[board.target], shortestNodes[j - 1]);

  // Final event for panel values + metrics in instant mode
  if (board.currentTrace) {
    var visitedCount = nodes.length;
    board.lastVisitedCount = visitedCount;
    var costObj = board.computePathCost();
    var pathCost = costObj && costObj.cost ? costObj.cost : 0;
    var totalNodes = Object.keys(board.nodes).length;
    var frontierSize = Math.max(totalNodes - visitedCount, 0);
    var lastEvent = board.currentTrace[board.currentTrace.length - 1];
    var finalValues = { g: pathCost, h: 0, f: pathCost };
    var finalMetrics = {
      visitedCount: visitedCount,
      pathCost: pathCost,
      frontierSize: frontierSize
    };

    if (lastEvent && lastEvent.t === "found_target") {
      lastEvent.values = finalValues;
      lastEvent.metrics = Object.assign({}, lastEvent.metrics, finalMetrics);
      if (board.updateExplanationPanel) {
        board.updateExplanationPanel(lastEvent);
      }
    } else {
      var finalEvent = {
        t: "found_target",
        step: board.currentTrace.length,
        target: board.target,
        values: finalValues,
        metrics: finalMetrics
      };
      board.currentTrace.push(finalEvent);
      if (board.updateExplanationPanel) {
        board.updateExplanationPanel(finalEvent);
      }
    }
  }

  function change(currentNode, previousNode) {
    let currentHTMLNode = document.getElementById(currentNode.id);
    let relevantClassNames = ["start", "shortest-path", "instantshortest-path", "instantshortest-path weight"];
    if (previousNode) {
      let previousHTMLNode = document.getElementById(previousNode.id);
      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        previousHTMLNode.className = previousNode.weight > 0 ? "instantvisited weight" : "instantvisited";
      }
    }
  }

  function shortestPathChange(currentNode, previousNode) {
    let currentHTMLNode = document.getElementById(currentNode.id);
    if (type === "unweighted") {
      currentHTMLNode.className = "shortest-path-unweighted";
    } else {
      if (currentNode.direction === "up") {
        currentHTMLNode.className = "shortest-path-up";
      } else if (currentNode.direction === "down") {
        currentHTMLNode.className = "shortest-path-down";
      } else if (currentNode.direction === "right") {
        currentHTMLNode.className = "shortest-path-right";
      } else if (currentNode.direction === "left") {
        currentHTMLNode.className = "shortest-path-left";
      }
    }
    if (previousNode) {
      let previousHTMLNode = document.getElementById(previousNode.id);
      previousHTMLNode.className = previousNode.weight > 0 ? "instantshortest-path weight" : "instantshortest-path";
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }

};

module.exports = launchInstantAnimations;
