import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../src/utils/openai_config.js";
import { Clients } from "../models/Clients.js";

export class clientController {

    static async startClientsSessions(clients) {

        clients.forEach((client) => {
            create({
                session: client.clientId,
                puppeteerOptions: {
                    headless: true,
                    args: [
                        "--no-sandbox",
                        `--user-data-dir=./tokens/${client.id}/chrome-profile  `,
                    ],
                }
            }).then((client) => {
                client.onMessage(async (message) => {
                    const phoneNumber = message.from.slice(0, 13)
                    if (phoneNumber != "status@broadc" && !message.isGroupMsg) {
                        // Lógica da mensagem
                        // if (message.isGroupMsg || !message.body) return;
                        // const gptMessage = await generateAnswer(message.body);
                        // client.sendText(message.from, gptMessage);
                        console.log(message)
                    } else {
                        console.log("é status");
                    }

                });
            });
            this.isPreviousContact(client)
        });
    }

    static async isPreviousContact(client, phoneNumber) {

    }

}
