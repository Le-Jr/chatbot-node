import { create } from "@wppconnect-team/wppconnect";
import { generateAnswer } from "../src/utils/openai_config.js";
import { Clients } from "../models/Clients.js";
import { PreviousContacts } from "../models/PreviousContacts.js"

export class clientController {

    static async startClientsSessions(clients) {

        clients.forEach((client) => {
            const currentClient = client
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
                        if(await this.isPreviousContact(currentClient.id,phoneNumber)){
                            console.log("já falou antes")
                        }else{
                            console.log(typeof phoneNumber,typeof currentClient)
                            await PreviousContacts.create({
                                phoneNumber:phoneNumber,
                                clientId:currentClient.id
                            })
                            client.sendText(message.from, currentClient.faq);
                        }

                    } else {
                        console.log("é status");
                    }

                });
            });
        });
    }

    static async isPreviousContact(client, phoneNumber) {
        const isContact = await PreviousContacts.findAll({
            where: {
                phoneNumber: phoneNumber,
                clientId: client
            }
        })
        if (isContact.length>0) {
            return true
        }
        return false
    }

}
