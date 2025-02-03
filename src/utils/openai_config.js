import OpenAI from "openai";
import "dotenv/config";

const key = process.env["OPEN_AI_KEY"];

const openai = new OpenAI({
  project: "proj_Q6YIIPWgtYS8O3W9x5Xvxblz",
  organization: "org-rKAJGiGYPIYjgz6o441DkC7V",
  apiKey: key,
});

export async function generateAnswer(message) {
  const prompt = `Você deve responder como um atendente de uma confeitaria chamada Doce e CIA.
faça o melhor para atender os clientes de forma cordial e educada, sendo o mais atencioso e detalhado possível.
vou passar abaixo a pergunta para que você possa responder:
${message}
`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_completion_tokens: 200,
    store: true,
    //   stream: true,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return completion.choices[0].message.content;
}
