import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import "dotenv/config";
import OpenAI from "openai";

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

async function start(client) {
  await client.onMessage((message) => {
    if (message.body === "Oi") {
      client
        .sendText(message.from, "Olá tudo Bem?")
        .then((result) => {
          console.log("Result: ", result);
        })
        .catch((err) => console.log("Erro detectado: ", err));
    }
  });

  await client
    .sendImageAsSticker("+5521981265872@c.us", "./img.jpg")
    .then((result) => {
      console.log("Result: ", result); //return object success
    })
    .catch((erro) => {
      console.error("Error when sending: ", erro); //return object error
    });
}
