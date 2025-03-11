import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../utils/openai_config.js";
import { Clients } from "../models/Clients.js";
import { PreviousContacts } from "../models/PreviousContacts.js";
import { Wjt } from "../models/Wtj.js";

export class clientController {
  static async startClientSession(req, res) {
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
        session: String(currentUser.name),
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
          res.json(currentUser);
        },
      }).then((client) => {
        console.log("aqui é o then");
        client.onMessage(async (message) => {
          const phoneNumber = message.from.slice(0, 13);
          this.sendMessage(message, client, currentUser, phoneNumber);
        });
      });
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
    if (phoneNumber != "status@broadc" && !message.isGroupMsg) {
      const isPreviousContact = await this.isPreviousContact(
        clientInfos.id,
        phoneNumber
      );
      if (isPreviousContact) {
        const gptMessage = await generateAnswer(
          `${isPreviousContact.context}\n ${phoneNumber}:${message.body}`
        );
        await PreviousContacts.update(
          {
            phoneNumber: phoneNumber,
            clientId: clientInfos.id,
            context: `${isPreviousContact.config}\n ${phoneNumber}:${message.body}\n chatgpt:${gptMessage}\n`,
          },
          {
            where: {
              phoneNumber: phoneNumber,
              clientId: clientInfos.id,
            },
          }
        );
        client.sendText(message.from, gptMessage);
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
