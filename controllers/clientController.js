import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../utils/openai_config.js";
import { Clients } from "../models/Clients.js";
import { PreviousContacts } from "../models/PreviousContacts.js";
import { Wjt } from "../models/Wtj.js";
import { io } from "../index.js"

let createdSessions = {}

export class clientController {
  static async startClientSession(req, res) {
    try {
      const auth = await Wjt.findOne({
        where: {
          clientId: req.body.id,
          wtjId: req.body.token,
        },
      });


      if (auth) {
        const currentUser = await Clients.findOne({
          raw: true,
          where: {
            id: req.body.id,
          },
        });
        if (req.body.isPersistentSession == true) {
          createdSessions[req.body.id].start()
        }

        let currentSession = await create({
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
          },
        })
          .then((client) => {
            if (!client) {
              console.error("Cliente não foi criado de forma apropriada 🤒");
              return;
            }


            client.onMessage(async (message) => {
              if (!client.connected || typeof client.sendText !== "function") {
                console.error(
                  "Client is not initalized properly or sendText is undefined"
                );
                return;
              }

              const phoneNumber = message.from.replace(/\D/g, "").slice(-13);

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


            createdSessions[currentUser.id] = client
            Clients.update({ isActiveSession: 1 }, { where: { id: currentUser.id } })
            if (req.body.isPersistentSession != true) {
              const socket = io.sockets.sockets.get(req.body.wsId)
              socket.emit("message", "usuário escaneou o qr code");
            }

          })
          .catch((error) => {
            console.error("Error creating client:", error);
            res
              .status(500)
              .json({ error: "Failed to initialize WhatsApp client" });
          });



      }
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async logoutSession(req, res) {
    try {
      createdSessions[req.body.id].close()
      await Clients.update({ isActiveSession: 0 }, { where: { id: req.body.id } })
      res.json({ result: "seção fechada com sucesso" })
    }
    catch {
      res.json({ error: "deu ruim" })
    }
  }
  static async isActiveSession(req, res) {
    if (createdSessions[req.body.id] != '') {
      res.json({ result: "seção persiste" })
    }
    res.json({ result: "seção pode ser Aberta" })

  }
  static async isPreviousContact(client, phoneNumber) {
    const isContact = await PreviousContacts.findAll({
      raw: true,
      where: {
        phoneNumber: phoneNumber,
        clientId: client,
      },
    });
    if (isContact.length > 0) {
      return isContact[0];
    }
    return false;
  }

  static async sendMessage(message, client, clientInfos, phoneNumber) {
    if (!message.from.includes("status") && !message.isGroupMsg) {
      const isPreviousContact = await this.isPreviousContact(
        clientInfos.id,
        phoneNumber
      );
      if (isPreviousContact) {
        console.log(clientInfos.config, phoneNumber, message.body)
        const responseChunks = await generateAnswer(
          `${clientInfos.config}. lembre-se de responder o mais naturalmente possível, humanos não costumam comprimentar ou se despedir em toda interação, evite o uso de listas, adote um formato de escrita com um padrão mais cotidiâno. a seguir temos o contexto da conversa que você já teve: ${isPreviousContact.context}/${phoneNumber}:${message.body} `,
          (chunk) => {
            return chunk;
          }
        );


        let updatedContext = `${isPreviousContact.context}\n /${phoneNumber}:${message.body}\n`;
        responseChunks.forEach((chunk) => {
          updatedContext += `/chatgpt:${chunk}\n`; // Adiciona cada parte separada ao contexto
        });


        await PreviousContacts.update(
          {
            phoneNumber: phoneNumber,
            context: updatedContext,
            // context: `${isPreviousContact.context}\n ${phoneNumber}:${message.body}\n chatgpt:${gptMessage}\n`,
          },
          {
            where: {
              phoneNumber: phoneNumber,
              clientId: clientInfos.id,
            },
          }
        )

        responseChunks.forEach(async (chunk, index) => {
          await new Promise(
            (resolve) =>
              setTimeout(() => {
                client.sendText(phoneNumber, chunk); // Envia cada parte separada
                resolve(); // Resolve a promise após o envio
              }, index * 1000 + 500) // Incrementa o atraso para garantir a ordem
          );
        });

        // client.sendText(message.from, gptMessage);
      } else {
        await PreviousContacts.create({
          phoneNumber: phoneNumber,
          clientId: clientInfos.id,
        });
        client.sendText(phoneNumber, clientInfos.faq);
      }
    } else {
      console.log("é status");
    }
  }
}
