import OpenAI from "openai";
import "dotenv/config";

const key = process.env["OPEN_AI_KEY"];

const openai = new OpenAI({
  project: "proj_Q6YIIPWgtYS8O3W9x5Xvxblz",
  organization: "org-rKAJGiGYPIYjgz6o441DkC7V",
  apiKey: key,
});

const message = await openai.chat.completions.create({
  model: "gpt-4o",
  max_completion_tokens: 200,
  store: true,
  //   stream: true,
  messages: [{ role: "user", content: "Olá tudo bem?" }],
  temperature: 0.5,
});

console.log(message.choices[0].message);
