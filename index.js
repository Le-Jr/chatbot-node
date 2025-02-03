import "dotenv/config";
import mongoose, { mongo } from "mongoose";
import { create } from "@wppconnect-team/wppconnect";
import { Client } from "./src/models/Client.js";

mongoose.connect(process.env["MONGO_URI"]);

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
      catchQR: (qrCode) => {
        Client.updateOne(
          { clientId: client.clientId },
          { qrCode: client.qrCode }
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
