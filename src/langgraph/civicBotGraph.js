const { StateGraph, END } = require("@langchain/langgraph");
const ai = require("../config/gemini");
const Issue = require("../models/Issue");
const {
  getIssueCountsByCategory,
  getStatusCounts,
  getHeatmapPoints,
  getTrendInsights,
} = require("../services/analyticsService");

const classifyQuestion = async (state) => {
  const question = state.question.toLowerCase();

  let intent = "recent";

  if (question.includes("category") || question.includes("type")) {
    intent = "category";
  } else if (
    question.includes("status") ||
    question.includes("open") ||
    question.includes("resolved")
  ) {
    intent = "status";
  } else if (
    question.includes("heatmap") ||
    question.includes("location") ||
    question.includes("nearby")
  ) {
    intent = "heatmap";
  } else if (
    question.includes("trend") ||
    question.includes("increase") ||
    question.includes("pattern")
  ) {
    intent = "trend";
  } else if (
    question.includes("urgent") ||
    question.includes("high priority")
  ) {
    intent = "priority";
  }

  return { ...state, intent };
};

const fetchData = async (state) => {
  let data = {};

  switch (state.intent) {
    case "category":
      data.issueCountsByCategory = await getIssueCountsByCategory();
      break;

    case "status":
      data.statusCounts = await getStatusCounts();
      break;

    case "heatmap":
      data.heatmapPoints = await getHeatmapPoints();
      break;

    case "trend":
      data.trendInsights = await getTrendInsights();
      break;

    case "priority":
      data.highPriorityIssues = await Issue.find({
        priority: { $in: ["HIGH", "URGENT"] },
      })
        .select("title category priority status createdAt")
        .sort({ createdAt: -1 });
      break;

    default:
      data.recentIssues = await Issue.find({})
        .select("title category priority status createdAt")
        .sort({ createdAt: -1 })
        .limit(10);
      break;
  }

  return { ...state, data };
};

const generateAnswer = async (state) => {
  const prompt = `
You are CivicCase AI, a helpful municipal assistant.

Answer the user's question clearly and briefly based only on the provided data.

User question:
${state.question}

Detected intent:
${state.intent}

Data:
${JSON.stringify(state.data, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return { ...state, answer: response.text.trim() };
};

const graph = new StateGraph({
  channels: {
    question: null,
    intent: null,
    data: null,
    answer: null,
  },
});

graph.addNode("classifyQuestion", classifyQuestion);
graph.addNode("fetchData", fetchData);
graph.addNode("generateAnswer", generateAnswer);

graph.addEdge("__start__", "classifyQuestion");
graph.addEdge("classifyQuestion", "fetchData");
graph.addEdge("fetchData", "generateAnswer");
graph.addEdge("generateAnswer", END);

const civicBotGraph = graph.compile();

module.exports = { civicBotGraph };
