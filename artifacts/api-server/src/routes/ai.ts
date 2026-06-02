import { Router } from "express";
import Groq from "groq-sdk";
import {
  GenerateSummaryBody,
  ImproveBulletBody,
  SuggestSkillsBody,
} from "@workspace/api-zod";

const router = Router();

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }
  return new Groq({ apiKey });
}

// Generate professional summary
router.post("/ai/generate-summary", async (req, res): Promise<void> => {
  const parsed = GenerateSummaryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const groq = getGroqClient();
    const { fullName, jobTitle, workExperience, skills } = parsed.data;

    const experienceSummary = (workExperience ?? [])
      .map((w) => `${w.title} at ${w.company}`)
      .join(", ");
    const skillsList = (skills ?? []).join(", ");

    const prompt = `Write a compelling, concise 2-3 sentence professional summary for a CV/resume. 

Name: ${fullName}
Target Role: ${jobTitle}
${experienceSummary ? `Experience: ${experienceSummary}` : ""}
${skillsList ? `Key Skills: ${skillsList}` : ""}

Write only the summary text, no labels or extra explanation. It should be first-person, achievement-focused, and tailored to the role.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ text });
  } catch (err) {
    req.log.error({ err }, "Failed to generate summary");
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Improve a bullet point
router.post("/ai/improve-bullet", async (req, res): Promise<void> => {
  const parsed = ImproveBulletBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const groq = getGroqClient();
    const { bullet, jobTitle, company } = parsed.data;

    const prompt = `Improve this CV/resume bullet point to be more impactful, quantifiable, and action-oriented. Use strong action verbs.

Role: ${jobTitle}${company ? ` at ${company}` : ""}
Original bullet: ${bullet}

Return ONLY the improved bullet point text, nothing else. Start with a strong action verb. Keep it to one line.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.6,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ text });
  } catch (err) {
    req.log.error({ err }, "Failed to improve bullet");
    res.status(500).json({ error: "Failed to improve bullet" });
  }
});

// Suggest skills
router.post("/ai/suggest-skills", async (req, res): Promise<void> => {
  const parsed = SuggestSkillsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const groq = getGroqClient();
    const { jobTitle, existingSkills } = parsed.data;

    const existing = (existingSkills ?? []).join(", ");
    const prompt = `Suggest 8-10 relevant professional skills for a ${jobTitle} role.
${existing ? `Already listed: ${existing}. Do NOT repeat these.` : ""}

Return ONLY a JSON array of skill strings, nothing else. Example: ["Python", "SQL", "Data Analysis"]`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "[]";
    let skills: string[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        skills = JSON.parse(match[0]);
      }
    } catch {
      skills = [];
    }

    res.json({ skills });
  } catch (err) {
    req.log.error({ err }, "Failed to suggest skills");
    res.status(500).json({ error: "Failed to suggest skills" });
  }
});

export default router;
