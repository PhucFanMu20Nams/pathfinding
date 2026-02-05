function unweightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name, trace) {
  if (!start || !target || start === target) {
    return false;
  }
  let structure = [nodes[start]];
  let exploredNodes = {start: true};
  while (structure.length) {
    let currentNode = name === "bfs" ? structure.shift() : structure.pop();
    if (trace) {
      trace.push({
        t: "select_current",
        step: trace.length,
        current: currentNode.id,
        reason: name === "bfs" ? "fifo_queue" : "lifo_stack",
        metrics: {
          frontierSize: structure.length,
          visitedCount: nodesToAnimate.length
        }
      });
    }
    nodesToAnimate.push(currentNode);
    if (name === "dfs") exploredNodes[currentNode.id] = true;
    currentNode.status = "visited";
    if (currentNode.id === target) {
      if (trace) {
        var pathLength = computePathLength(nodes, start, target);
        trace.push({
          t: "found_target",
          step: trace.length,
          target: target,
          metrics: {
            visitedCount: nodesToAnimate.length,
            pathCost: pathLength
          }
        });
      }
      return "success";
    }
    let currentNeighbors = getNeighbors(currentNode.id, nodes, boardArray, name);
    if (trace) {
      traceWallNeighbors(currentNode, nodes, boardArray, trace);
    }
    currentNeighbors.forEach(neighbor => {
      if (!exploredNodes[neighbor]) {
        if (name === "bfs") exploredNodes[neighbor] = true;
        nodes[neighbor].previousNode = currentNode.id;
        structure.push(nodes[neighbor]);
      } else if (trace) {
        trace.push({
          t: "skip_neighbor",
          step: trace.length,
          from: currentNode.id,
          to: neighbor,
          reason: "visited"
        });
      }
    });
  }
  return false;
}

function getNeighbors(id, nodes, boardArray, name) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  return neighbors;
}

function traceWallNeighbors(node, nodes, boardArray, trace) {
  let coordinates = node.id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
    if (nodes[potentialNeighbor].status === "wall") {
      trace.push({ t: "skip_neighbor", step: trace.length, from: node.id, to: potentialNeighbor, reason: "wall" });
    }
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
    if (nodes[potentialNeighbor].status === "wall") {
      trace.push({ t: "skip_neighbor", step: trace.length, from: node.id, to: potentialNeighbor, reason: "wall" });
    }
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
    if (nodes[potentialNeighbor].status === "wall") {
      trace.push({ t: "skip_neighbor", step: trace.length, from: node.id, to: potentialNeighbor, reason: "wall" });
    }
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
    if (nodes[potentialNeighbor].status === "wall") {
      trace.push({ t: "skip_neighbor", step: trace.length, from: node.id, to: potentialNeighbor, reason: "wall" });
    }
  }
}

function computePathLength(nodes, start, target) {
  var length = 0;
  var current = nodes[target];
  while (current && current.id !== start) {
    length++;
    current = nodes[current.previousNode];
  }
  if (current && current.id === start) {
    length++;
  }
  return length;
}

module.exports = unweightedSearchAlgorithm;
