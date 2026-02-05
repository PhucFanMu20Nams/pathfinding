require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/api/explain", async (req, res) => {
  const digest = req.body;

  if (!digest || !digest.algorithmKey || typeof digest.visitedCount !== "number") {
    console.error("[AI Explain] Invalid digest received:", digest);
    return res.status(400).json({
      error: "Invalid digest: missing algorithmKey or visitedCount",
      explanation: null
    });
  }

  console.log("[AI Explain] Received digest for:", digest.algorithmKey);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "sk-your-api-key-here") {
    console.warn("[AI Explain] No valid OPENAI_API_KEY found, using fallback");
    return res.json({
      explanation: generateFallback(digest),
      source: "fallback"
    });
  }

  try {
    const explanation = await callOpenAI(apiKey, digest);
    console.log("[AI Explain] Successfully generated explanation");
    res.json({ explanation: explanation, source: "ai" });
  } catch (error) {
    console.error("[AI Explain] OpenAI API error:", error.message);
    res.json({
      explanation: generateFallback(digest),
      source: "fallback"
    });
  }
});

async function callOpenAI(apiKey, digest) {
  const prompt = buildPrompt(digest);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an educational assistant explaining pathfinding algorithms to beginners.\n\nSTRICT RULES:\n1. Output EXACTLY 3 sentences. No more, no less.\n2. Use simple English (Feynman-level). NO jargon like \"heuristic\", \"priority queue\", \"relaxation\", \"frontier\".\n3. ONLY use facts from the provided digest. Never invent numbers or steps.\n4. Describe what happened in THIS run, not how the algorithm works in general.\n5. Do NOT give advice, tips, or suggestions.\n6. Start with what the algorithm did, then describe the result."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || "HTTP " + response.status;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function buildPrompt(digest) {
  const algoName = formatAlgorithmName(digest.algorithmKey);
  const meta = digest.meta || {};

  let prompt = "Summarize this pathfinding run in exactly 3 sentences:\n\n";

  prompt += "Algorithm: " + algoName + "\n";
  prompt += "Algorithm type: " + (meta.algorithmFamily || "unknown") + "\n";
  prompt += "Guarantees shortest path: " + (meta.guaranteesOptimal ? "yes" : "no") + "\n";

  if (meta.selectionRule) {
    prompt += "How it picks nodes: " + meta.selectionRule + "\n";
  }

  prompt += "\n";
  prompt += "Start position: " + digest.start + "\n";
  prompt += "Target position: " + digest.target + "\n";
  prompt += "Total nodes checked: " + digest.visitedCount + "\n";
  prompt += "Final path length: " + digest.pathLength + " steps\n";

  if (digest.wallCount > 0) {
    prompt += "Walls blocking the way: " + digest.wallCount + "\n";
  }

  if (digest.weightCount > 0) {
    prompt += "Weighted (slower) nodes: " + digest.weightCount + "\n";
  }

  if (digest.pathSample && digest.pathSample.length > 0) {
    prompt += "\nPath taken: " + digest.pathSample.join(" → ") + "\n";
  }

  return prompt;
}

function formatAlgorithmName(key) {
  const names = {
    dijkstra: "Dijkstra's Algorithm",
    astar: "A* Search",
    greedy: "Greedy Best-first Search",
    CLA: "Swarm Algorithm",
    swarm: "Swarm Algorithm",
    "convergent swarm": "Convergent Swarm Algorithm",
    bidirectional: "Bidirectional Swarm",
    bfs: "Breadth-first Search",
    dfs: "Depth-first Search"
  };
  return names[key] || key;
}

function generateFallback(digest) {
  const algoName = formatAlgorithmName(digest.algorithmKey);
  let text = "The " + algoName + " explored " + digest.visitedCount + " nodes before finding the target. ";
  text += "The final path uses " + digest.pathLength + " steps. ";

  if (digest.weightCount > 0) {
    text += "Weight nodes added extra cost to some paths.";
  } else {
    text += "All nodes had equal movement cost.";
  }

  return text;
}

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("Pathfinding Visualizer Server");
  console.log("=".repeat(50));
  console.log("Server running at: http://localhost:" + PORT);
  console.log("");

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-api-key-here") {
    console.log("✓ OPENAI_API_KEY detected — AI explanations enabled");
  } else {
    console.log("⚠ No OPENAI_API_KEY — fallback explanations only");
    console.log("  To enable AI: Add your key to .env file");
  }

  console.log("=".repeat(50));
});
