import OpenAI from "openai";
import "dotenv/config";

const key = process.env["OPEN_AI_KEY"];

const openai = new OpenAI({
  project: "proj_Q6YIIPWgtYS8O3W9x5Xvxblz",
  organization: "org-rKAJGiGYPIYjgz6o441DkC7V",
  apiKey: key,
});

// Função para dividir mensagens grandes em partes menores
function splitMessage(text, maxLength = 100) {
  const sentences = text.split(/(?<=[.!?])\s+/); // Divide por frases
  let chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      chunks.push(currentChunk.trim()); // Salva o bloco atual
      currentChunk = sentence; // Começa um novo
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence; // Continua acumulando
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim()); // Adiciona o último bloco

  return chunks;
}

// Função para gerar resposta com envio gradual
export async function generateAnswer(message, sendMessageCallback) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 200, // Corrigido para `max_tokens`
    messages: [{ role: "user", content: message }],
    temperature: 0.5,
  });

  const responseText = completion.choices[0].message.content;
  const responseChunks = splitMessage(responseText, 100); // Divide resposta

  for (let i = 0; i < responseChunks.length; i++) {
    const chunk = responseChunks[i];
    await new Promise(
      (resolve) =>
        setTimeout(() => {
          sendMessageCallback(chunk); // Envia a parte da mensagem usando o callback
          resolve(); // Resolve a promise após o envio
        }, Math.random() * 1000 + 500) // Atraso entre 500ms e 1.5s
    );
  }

  return responseChunks;
}

// import OpenAI from "openai";
// import "dotenv/config";

// const key = process.env["OPEN_AI_KEY"];

// const openai = new OpenAI({
//   project: "proj_Q6YIIPWgtYS8O3W9x5Xvxblz",
//   organization: "org-rKAJGiGYPIYjgz6o441DkC7V",
//   apiKey: key,
// });

// export async function generateAnswer(message) {
//   const prompt = `
// ${message}
// `;
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o",
//     max_completion_tokens: 200,
//     store: true,
//     //   stream: true,
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.5,
//   });

//   return completion.choices[0].message.content;
// }
