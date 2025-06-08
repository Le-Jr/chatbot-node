import axios from "axios";

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
export async function generateAnswer(message, client_id, sendMessageCallback) {
  try {
    const response = await axios.post(
      "https://api.mercuriochat.com.br/perguntar",
      {
        question: message,
        client_id: String(client_id),
      }
    );

    const responseText = response.data.resposta;
    console.log(`Resposta API: ${responseText}`);
    const responseChunks = splitMessage(responseText, 100);

    for (let i = 0; i < responseChunks.length; i++) {
      const chunk = responseChunks[i];
      await new Promise((resolve) =>
        setTimeout(() => {
          sendMessageCallback(chunk); // Envia a parte da mensagem usando o callback
          resolve(); // Resolve a promise após o envio
        }, 0)
      );
    }

    return responseChunks;
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    throw error;
  }
}
