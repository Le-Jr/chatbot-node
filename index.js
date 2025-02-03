import "dotenv/config";
import mongoose from "mongoose";
import { create } from "@wppconnect-team/wppconnect";
import { Client } from "./src/models/Client.js";

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(" ✅ Conectado com sucesso");
} catch (err) {
  console.log("Erro ao conectar: ", err);
}

async function startClientsSessions() {
  //   try {
  //     const clients = await Client.find();
  //   } catch (err) {
  //     console.log("Erro buscando no banco: ", err);
  //   }

  const clients = await Client.find();
  clients.forEach((client) => {
    create({
      session: client.clientId,
      puppeteerOptions: { headless: true },
      catchQR: async (base64Qr, attempts) => {
        await Client.updateOne(
          { clientId: client.clientId },
          { qrCode: base64Qr }
        );
      },
    }).then((client) => {
      client.onMessage(async (message) => {
        // Lógica da mensagem

        if (message.isGroupMsg || !message.body) return;
        client.sendText(message.from, "Olá! tudo bem?");
      });
    });
  });
}

startClientsSessions();
