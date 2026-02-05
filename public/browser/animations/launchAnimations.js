const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");
const historyStorage = require("../utils/historyStorage");
const serializeRun = require("../utils/runSerializer");

function launchAnimations(board, success, type) {
  let nodes = board.nodesToAnimate.slice(0);
  let speed = board.speed === "fast" ?
    0 : board.speed === "average" ?
      100 : 500;
  let shortestNodes;
  function timeout(index) {
    setTimeout(function () {
      if (index === nodes.length) {
        board.lastVisitedCount = nodes.length;
        board.nodesToAnimate = [];
        if (board.currentTrace && board.currentTrace.length > 0 && board.updateExplanationPanel) {
          var finalEvent = board.currentTrace[board.currentTrace.length - 1];
          board.updateExplanationPanel(finalEvent);
        }
        if (success) {
          if (document.getElementById(board.target).className !== "visitedTargetNodeBlue") {
            document.getElementById(board.target).className = "visitedTargetNodeBlue";
          }
          board.drawShortestPathTimeout(board.target, board.start, type);
          board.reset();
          // Save run to history + display cost
          var visitedCount = nodes.length;
          board.displayPathCost(visitedCount);
          var runSummary = serializeRun(board, success, visitedCount);
          historyStorage.saveRun(runSummary);
          console.log("[Run Complete]", runSummary);
          shortestNodes = board.shortestPathNodesToAnimate;
          return;
        } else {
          console.log("Failure.");
          board.reset();
          board.toggleButtons();
          return;
        }
      } else if (index === 0) {
        if (document.getElementById(board.start).className !== "visitedStartNodePurple") {
          document.getElementById(board.start).className = "visitedStartNodeBlue";
        }
        if (board.currentAlgorithm === "bidirectional") {
          document.getElementById(board.target).className = "visitedTargetNodeBlue";
        }
        change(nodes[index])
      } else if (index === nodes.length - 1 && board.currentAlgorithm === "bidirectional") {
        change(nodes[index], nodes[index - 1], "bidirectional");
      } else {
        change(nodes[index], nodes[index - 1]);
      }
      if (board.currentTrace && board.currentTrace.length > 0 && board.updateExplanationPanel) {
        var traceIndex = Math.min(board.traceCursor, board.currentTrace.length - 1);
        var event = board.currentTrace[traceIndex];
        board.updateExplanationPanel(event);
        board.traceCursor = Math.min(board.traceCursor + 1, board.currentTrace.length - 1);
      }
      timeout(index + 1);
    }, speed);
  }

  function change(currentNode, previousNode, bidirectional) {
    let currentHTMLNode = document.getElementById(currentNode.id);
    let relevantClassNames = ["start", "target", "visitedStartNodeBlue", "visitedStartNodePurple", "visitedTargetNodePurple", "visitedTargetNodeBlue"];
    if (!relevantClassNames.includes(currentHTMLNode.className)) {
      currentHTMLNode.className = !bidirectional ?
        "current" : currentNode.weight > 0 ?
          "visited weight" : "visited";
    }
    if (currentHTMLNode.className === "visitedStartNodePurple") {
      currentHTMLNode.className = "visitedStartNodeBlue";
    }
    if (previousNode) {
      let previousHTMLNode = document.getElementById(previousNode.id);
      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        previousHTMLNode.className = previousNode.weight > 0 ? "visited weight" : "visited";
      }
    }
  }

  function shortestPathTimeout(index) {
    setTimeout(function () {
      if (index === shortestNodes.length) {
        board.reset();
        shortestPathChange(board.nodes[board.target], shortestNodes[index - 1]);
        board.shortestPathNodesToAnimate = [];
        return;
      } else if (index === 0) {
        shortestPathChange(shortestNodes[index])
      } else {
        shortestPathChange(shortestNodes[index], shortestNodes[index - 1]);
      }
      shortestPathTimeout(index + 1);
    }, 40);
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
      } else if (currentNode.direction = "down-right") {
        currentHTMLNode.className = "wall"
      }
    }
    if (previousNode) {
      let previousHTMLNode = document.getElementById(previousNode.id);
      previousHTMLNode.className = "shortest-path";
    } else {
      let element = document.getElementById(board.start);
      element.className = "shortest-path";
      element.removeAttribute("style");
    }
  }

  timeout(0);

};

module.exports = launchAnimations;
