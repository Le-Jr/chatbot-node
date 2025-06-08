import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../utils/openai_config.js";
import { Clients } from "../models/Clients.js";
import { PreviousContacts } from "../models/PreviousContacts.js";
import { Wjt } from "../models/Wtj.js";
import { io } from "../index.js";

let createdSessions = {};

export class clientController {
  static async startClientSession(req, res) {
    const { id, wsId } = req.body;

    // Validação de entrada
    if (!id) {
      return res.status(400).json({ error: "Client ID is required" });
    }
    if (!wsId) {
      return res.status(400).json({ error: "wsId is required" });
    }

    const currentUser = await Clients.findOne({
      where: { id },
    });

    if (!currentUser) {
      return res.status(404).json({ error: "Client not found" });
    }

    create({
      session: `whatsapp_bot_${currentUser.id}`,
      puppeteerOptions: {
        headless: true,
        args: [
          "--no-sandbox",
          `--user-data-dir=./tokens/${currentUser.id}/chrome-profile`,
        ],
        session: {
          autoClose: 0,
        },
      },
      catchQR: async (base64Qr) => {
        await Clients.update(
          { qrCode: base64Qr },
          { where: { id: currentUser.id } }
        );
      },
    })
      .then(async (client) => {
        if (!client) {
          return res.status(500).json({ error: "Client creation failed" });
        }

        client.onMessage(async (message) => {
          if (!client.connected || typeof client.sendText !== "function") {
            console.error(
              "Client is not initialized properly or sendText is undefined"
            );
            return;
          }

          const phoneNumber = message.from.replace(/\D/g, "");
          if (phoneNumber.length < 10) {
            console.error("Invalid phone number format:", phoneNumber);
            return;
          }
          const formattedPhoneNumber = phoneNumber.slice(-13);

          try {
            await clientController.sendMessage(
              message,
              client,
              currentUser,
              formattedPhoneNumber
            );
          } catch (err) {
            console.error("Error handling message:", err);
            await client.sendText(
              message.from,
              "⚠️ Ocorreu um erro ao processar sua mensagem"
            );
          }
        });

        createdSessions[currentUser.id] = client;

        await Clients.update(
          { isActiveSession: 1 },
          { where: { id: currentUser.id } }
        );

        const socket = io.sockets.sockets.get(wsId);
        if (!socket) {
          return res.status(404).json({ error: "Socket not found" });
        }
        socket.emit("message", "usuário escaneou o qr code");

        res.json({ qrCode: currentUser.qrCode });
      })
      .catch((error) => {
        console.error("Error creating client:", error);
        res.status(500).json({ error: "Failed to initialize WhatsApp client" });
      });
  }

  static async logoutSession(req, res) {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Client ID is required" });
    }

    const client = createdSessions[id];
    if (!client) {
      return res.status(404).json({ error: "Session not found" });
    }

    try {
      await client.logout();
      await client.close();
      await Clients.update(
        { isActiveSession: 0 },
        { where: { id } }
      );
      delete createdSessions[id];
      res.json({ result: "Seção fechada com sucesso" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Failed to close session" });
    }
  }

  static async isActiveSession(req, res) {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Client ID is required" });
    }

    const isLogged = createdSessions[id];

    if (!isLogged) {
      return res.json({ result: "Seção pode ser aberta" });
    }

    return res.json({ result: "Seção persiste" });
  }

  static async isPreviousContact(clientId, phoneNumber) {
    const isContact = await PreviousContacts.findAll({
      raw: true,
      where: {
        phoneNumber,
        clientId,
      },
    });
    if (isContact.length > 0) {
      return isContact[0];
    }
    return false;
  }

  static async sendMessage(message, client, clientInfos, phoneNumber) {
    if (!clientInfos.id) {
      console.error("Invalid clientInfos.id");
      return;
    }

    if (!message.from.includes("status") && !message.isGroupMsg) {
      const user = await Clients.findOne({ where: { id: clientInfos.id } });
      if (!user) {
        console.error("User not found for client ID:", clientInfos.id);
        return;
      }

      const isPreviousContact = await this.isPreviousContact(
        clientInfos.id,
        phoneNumber
      );
      if (isPreviousContact) {
        const responseChunks = await generateAnswer(
          `${user.config}. lembre-se de responder o mais naturalmente possível, humanos não costumam
           cumprimentar ou se despedir em toda interação, evite o uso de listas, adote um formato de escrita com um padrão mais cotidiano.
           a seguir temos o contexto da conversa que você já teve: /${isPreviousContact.context} / ${phoneNumber}:${message.body} `,
          clientInfos.id,
          (chunk) => chunk
        );

        let updatedContext = `${isPreviousContact.context}\n/${phoneNumber}:${message.body}\n`;
        responseChunks.forEach((chunk) => {
          updatedContext += `/chatgpt:${chunk}\n`;
        });

        await PreviousContacts.update(
          {
            phoneNumber,
            context: updatedContext,
          },
          {
            where: {
              phoneNumber,
              clientId: clientInfos.id,
            },
          }
        );

        for (const [index, chunk] of responseChunks.entries()) {
          await new Promise((resolve) =>
            setTimeout(() => {
              client.sendText(phoneNumber, chunk);
              resolve();
            }, index * 1000 + 500)
          );
        }
      } else {
        await PreviousContacts.create({ phoneNumber, clientId: clientInfos.id });
        await client.sendText(phoneNumber, clientInfos.faq);
      }
    }
  }
}
