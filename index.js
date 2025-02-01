import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import "dotenv/config";
import { generateAnswer } from "./src/chatbot.js";

create({
  catchQR: (attempts, base64Qrimg) => {
    console.log("Atempts to login: ", attempts);
    console.log("QR code: ", base64Qrimg);
  },
  statusFind: (statusSession, session) => {
    console.log("Status Session: ", statusSession);
    console.log("Session: ", session);
  },
  session: "Teste",
  headless: true,
  useChrome: true,
  devtools: false,
  logQR: true,
  updatesLog: true,
  puppeteerOptions: { args: ["--no-sandbox"] },
})
  .then((client) => start(client))
  .catch((err) => console.log(err));

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg || !message.body) return;

    const answer = await generateAnswer(message.body);
    await client
      .sendText(message.from, answer)
      .then((result) => {
        console.log("Result: ", result);

        console.log(" Mensagem nova: ", message.body);
      })
      .catch((err) => console.log("Erro detectado: ", err));
  });
}
