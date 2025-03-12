import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../utils/openai_config.js";
import { Clients } from "../models/Clients.js";
import { PreviousContacts } from "../models/PreviousContacts.js";
import { Wjt } from "../models/Wtj.js";

export class clientController {
  static async startClientSession(req, res) {
    try {
      const auth = await Wjt.findOne({
        where: {
          clientId: req.body.id,
          wtjId: req.body.token,
        },
      });

      console.log("aqui tem que passar");

      if (auth) {
        const currentUser = await Clients.findOne({
          where: {
            id: req.body.id,
          },
        });
        console.log(currentUser.id);
        await create({
          // session: String(currentUser.name),
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
          catchQR: async (base64Qr, attempts) => {
            currentUser.qrCode = base64Qr;
            res.json({ qrCode: base64Qr });
            // res.json(currentUser);
          },
        })
          .then((client) => {
            if (!client) {
              console.error("Cliente não foi criado de forma apropriada 🤒");
              return;
            }

            console.log("✅ Cliente criado adquadamente: ");

            // console.log("aqui é o then");
            client.onMessage(async (message) => {
              if (!client.connected || typeof client.sendText !== "function") {
                console.error(
                  "Client is not initalized properly or sendText is undefined"
                );
                return;
              }

              const phoneNumber = message.from.replace(/\D/g, "").slice(-13);
              // const phoneNumber = message.from.slice(0, 13);

              try {
                await clientController.sendMessage(
                  message,
                  client,
                  currentUser,
                  phoneNumber
                );
              } catch (err) {
                console.error("Error handling message: ", err);
                client.sendText(
                  message.from,
                  "⚠️ Ocorreu um erro ao processar sua mensagem"
                );
              }
            });
          })
          .catch((error) => {
            console.error("Error creating client:", error);
            res
              .status(500)
              .json({ error: "Failed to initialize WhatsApp client" });
          });
      }
    } catch (err) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async isPreviousContact(client, phoneNumber) {
    const isContact = await PreviousContacts.findAll({
      raw: true,
      where: {
        phoneNumber: phoneNumber,
        clientId: client,
      },
    });
    console.log(isContact);
    if (isContact.length > 0) {
      return isContact[0];
    }
    return false;
  }

  static async getContextMessage(client, phoneNumber) {}

  static async sendMessage(message, client, clientInfos, phoneNumber) {
    if (!message.from.includes("status") && !message.isGroupMsg) {
      const isPreviousContact = await this.isPreviousContact(
        clientInfos.id,
        phoneNumber
      );
      if (isPreviousContact) {
        const responseChunks = await generateAnswer(
          `${isPreviousContact.context}\n ${phoneNumber}:${message.body}`,
          (chunk) => {
            console.log("Bot:", chunk);
            return chunk;
          }
        );

        let updatedContext = `${isPreviousContact.context}\n ${phoneNumber}:${message.body}\n`;
        responseChunks.forEach((chunk) => {
          updatedContext += `chatgpt:${chunk}\n`; // Adiciona cada parte separada ao contexto
        });

        await PreviousContacts.update(
          {
            phoneNumber: phoneNumber,
            clientId: clientInfos.id,
            context: updatedContext,
            // context: `${isPreviousContact.context}\n ${phoneNumber}:${message.body}\n chatgpt:${gptMessage}\n`,
          },
          {
            where: {
              phoneNumber: phoneNumber,
              clientId: clientInfos.id,
            },
          }
        );

        responseChunks.forEach(async (chunk, index) => {
          await new Promise(
            (resolve) =>
              setTimeout(() => {
                client.sendText(message.from, chunk); // Envia cada parte separada
                resolve(); // Resolve a promise após o envio
              }, index * 1000 + 500) // Incrementa o atraso para garantir a ordem
          );
        });

        // client.sendText(message.from, gptMessage);
      } else {
        await PreviousContacts.create({
          phoneNumber: phoneNumber,
          clientId: clientInfos.id,
          context: clientInfos.config,
        });
        client.sendText(message.from, clientInfos.faq);
      }
    } else {
      console.log("é status");
    }
  }
}
