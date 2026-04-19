const ai = require("../config/gemini");

const categorizeIssueWithAI = async (title, description) => {
  console.log("GEMINI_API_KEY exists?", !!process.env.GEMINI_API_KEY);

  const prompt = `
You are an AI assistant for a Canadian municipality.

Analyze this civic issue and return ONLY valid JSON in this format:
{
  "aiCategory": "POTHOLE|STREETLIGHT|FLOODING|SAFETY|OTHER",
  "aiSummary": "short summary in one sentence",
  "priority": "LOW|MEDIUM|HIGH|URGENT"
}

Issue title: ${title}
Issue description: ${description}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const responseText = response.text.trim();
  console.log("Raw Gemini response:", responseText);

  const cleaned = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No valid JSON object found in Gemini response");
  }

  return JSON.parse(match[0]);
};

module.exports = { categorizeIssueWithAI };
