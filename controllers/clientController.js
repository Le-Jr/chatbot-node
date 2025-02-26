import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../utils/openai_config.js";
import { Clients } from "../models/Clients.js";
import { PreviousContacts } from "../models/PreviousContacts.js";

export class clientController {
  static async startClientSession(res, client) {
    const currentClient = client;
    // console.log(currentClient);
    create({
      session: currentClient.id,
      puppeteerOptions: {
        headless: true,
        args: [
          "--no-sandbox",
          `--user-data-dir=./tokens/${currentClient.id}/chrome-profile  `,
        ],
        session: {
          autoClose: 0, // Defina 0 para desativar o auto-close
        },
      },
      catchQR: async (base64Qr, attempts) => {
        currentClient["currentUser"].qrCode = base64Qr;
        await res.render("conect", {
          currentUser: currentClient["currentUser"],
        });
      },
    }).then((client) => {
      client.onMessage(async (message) => {
        const phoneNumber = message.from.slice(0, 13);
        // console.log("Cliente Atual: ", currentClient["currentUser"]);
        this.sendMessage(
          message,
          client,
          currentClient["currentUser"],
          phoneNumber
        );
      });
    });
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
