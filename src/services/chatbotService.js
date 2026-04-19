const { civicBotGraph } = require("../langgraph/civicBotGraph");

const askCivicBot = async (question) => {
  const result = await civicBotGraph.invoke({
    question,
    intent: null,
    data: null,
    answer: null,
  });

  return result.answer;
};

module.exports = { askCivicBot };
