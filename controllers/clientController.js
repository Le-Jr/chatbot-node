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
                    this.sendMessage(message, client, currentClient, phoneNumber)
                });
            });
        });
    }

    static async isPreviousContact(client, phoneNumber) {
        const isContact = await PreviousContacts.findAll({
            raw: true,
            where: {
                phoneNumber: phoneNumber,
                clientId: client
            }
        })
        console.log(isContact)
        if (isContact.length > 0) {
            return isContact[0]
        }
        return false
    }

    static async getContextMessage(client, phoneNumber) {

    }

    static async sendMessage(message, client, clientInfos, phoneNumber) {
        if (phoneNumber != "status@broadc" && !message.isGroupMsg) {
            // Lógica da mensagem
            // if (message.isGroupMsg || !message.body) return;
            
            
            // client.sendText(message.from, gptMessage);
            const isPreviousContact = await this.isPreviousContact(clientInfos.id, phoneNumber)
            if (isPreviousContact) {

                const gptMessage = await generateAnswer(`${isPreviousContact.context}\n ${phoneNumber}:${message.body}`);
                await PreviousContacts.update({
                    phoneNumber: phoneNumber,
                    clientId: clientInfos.id,
                    context: `${isPreviousContact.context}\n ${phoneNumber}:${message.body}\n chatgpt:${gptMessage}\n`
                }, {
                    where: {
                        phoneNumber: phoneNumber,
                        clientId: clientInfos.id
                    }
                },
                )
                


                client.sendText(message.from, gptMessage);
            } else {
                await PreviousContacts.create({
                    phoneNumber: phoneNumber,
                    clientId: clientInfos.id,
                    context: `estou te usando como um atendente, e esse é o contexto da conversa que você deve seguir, lembre se de responder sempre a ultima pergunta do usuário sem ter que remeter diretamente esse script ${clientInfos.config} `
                })
                client.sendText(message.from, clientInfos.faq);
            }

        } else {
            console.log("é status");
        }
    }
}
