import { Router } from "express";
import Groq from "groq-sdk";
import {
  GenerateSummaryBody,
  ImproveBulletBody,
  SuggestSkillsBody,
  ScoreResumeBody,
} from "@workspace/api-zod";

const router = Router();

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  return new Groq({ apiKey });
}

router.post("/ai/generate-summary", async (req, res): Promise<void> => {
  const parsed = GenerateSummaryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const groq = getGroqClient();
    const { fullName, jobTitle, workExperience, skills } = parsed.data;
    const experienceSummary = (workExperience ?? []).map((w) => `${w.title} at ${w.company}`).join(", ");
    const skillsList = (skills ?? []).join(", ");
    const prompt = `Write a compelling, concise 2-3 sentence professional summary for a CV/resume.
Name: ${fullName}
Target Role: ${jobTitle}
${experienceSummary ? `Experience: ${experienceSummary}` : ""}
${skillsList ? `Key Skills: ${skillsList}` : ""}
Write only the summary text, no labels or extra explanation. First-person, achievement-focused.`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200, temperature: 0.7,
    });
    res.json({ text: completion.choices[0]?.message?.content?.trim() ?? "" });
  } catch (err) {
    req.log.error({ err }, "Failed to generate summary");
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

router.post("/ai/improve-bullet", async (req, res): Promise<void> => {
  const parsed = ImproveBulletBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const groq = getGroqClient();
    const { bullet, jobTitle, company } = parsed.data;
    const prompt = `Improve this CV bullet point to be more impactful with strong action verbs.
Role: ${jobTitle}${company ? ` at ${company}` : ""}
Original: ${bullet}
Return ONLY the improved bullet, nothing else. Start with a strong action verb. One line.`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100, temperature: 0.6,
    });
    res.json({ text: completion.choices[0]?.message?.content?.trim() ?? "" });
  } catch (err) {
    req.log.error({ err }, "Failed to improve bullet");
    res.status(500).json({ error: "Failed to improve bullet" });
  }
});

router.post("/ai/suggest-skills", async (req, res): Promise<void> => {
  const parsed = SuggestSkillsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const groq = getGroqClient();
    const { jobTitle, existingSkills } = parsed.data;
    const existing = (existingSkills ?? []).join(", ");
    const prompt = `Suggest 8-10 relevant professional skills for a ${jobTitle} role.
${existing ? `Already listed: ${existing}. Do NOT repeat these.` : ""}
Return ONLY a JSON array of skill strings, nothing else. Example: ["Python", "SQL"]`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200, temperature: 0.5,
    });
    const content = completion.choices[0]?.message?.content?.trim() ?? "[]";
    let skills: string[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) skills = JSON.parse(match[0]);
    } catch { skills = []; }
    res.json({ skills });
  } catch (err) {
    req.log.error({ err }, "Failed to suggest skills");
    res.status(500).json({ error: "Failed to suggest skills" });
  }
});

router.post("/ai/score-resume", async (req, res): Promise<void> => {
  const parsed = ScoreResumeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const groq = getGroqClient();
    const { resumeData } = parsed.data;
    const prompt = `You are a professional CV reviewer. Analyze this resume data and provide a detailed score with feedback.

Resume data: ${JSON.stringify(resumeData)}

Score the resume across these 5 categories (20 points each, 100 total):
1. Contact & Completeness - Is all contact info present? Is every section filled out?
2. Summary Quality - Is the summary compelling, specific, and well-written?
3. Experience Impact - Are bullet points action-oriented with measurable results?
4. Skills Relevance - Are skills listed and relevant to the stated job title?
5. Overall Presentation - Is the resume well-structured with good coverage across sections?

Respond with ONLY valid JSON in this exact format:
{
  "totalScore": <number 0-100>,
  "maxScore": 100,
  "grade": "<A/B/C/D/F>",
  "summary": "<2-sentence overall assessment>",
  "breakdown": [
    {
      "category": "Contact & Completeness",
      "score": <0-20>,
      "maxScore": 20,
      "feedback": "<specific feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    {
      "category": "Summary Quality",
      "score": <0-20>,
      "maxScore": 20,
      "feedback": "<specific feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    {
      "category": "Experience Impact",
      "score": <0-20>,
      "maxScore": 20,
      "feedback": "<specific feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    {
      "category": "Skills Relevance",
      "score": <0-20>,
      "maxScore": 20,
      "feedback": "<specific feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    {
      "category": "Overall Presentation",
      "score": <0-20>,
      "maxScore": 20,
      "feedback": "<specific feedback>",
      "tips": ["<tip1>", "<tip2>"]
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000, temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "{}";
    let scoreResult;
    try {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) scoreResult = JSON.parse(match[0]);
      else throw new Error("No JSON found");
    } catch {
      scoreResult = {
        totalScore: 50, maxScore: 100, grade: "C",
        summary: "Unable to parse score. Please try again.",
        breakdown: []
      };
    }
    res.json(scoreResult);
  } catch (err) {
    req.log.error({ err }, "Failed to score resume");
    res.status(500).json({ error: "Failed to score resume" });
  }
});

export default router;
