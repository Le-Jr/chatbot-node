
import { ClientsPlans } from "../models/ClientsPlans.js";
import { ServicePlans } from "../models/ServicePlans.js";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Clients } from "../models/Clients.js";

const client = new MercadoPagoConfig({ accessToken: 'TEST-1518391375042209-031618-771d1f999699cb8e15b268d22961eff1-2329930160' });
const preference = new Preference(client);
let plans = await ServicePlans.findAll({ raw: true })




export class plansController {

    static async renderPlans(req, res) {
        const user = {
            id: req.params.id,
            token: req.params.wtj,
        };

        const currentPlans = await Promise.all(plans.map(async (plan) => {
            await preference.create({
                body: {
                    back_urls: {
                        "success": `https://localhost:3000/user/${user.id}/${user.wtj}`
                    },
                    items: [
                        {
                            title: plan.name,
                            quantity: 1,
                            unit_price: Math.floor(plan.price)
                        }
                    ],
                    metadata: {
                        "PlanId": plan.id,
                        "userId": user.id
                    }
                }
            })
                .then((preference) => {
                    plan.preferenceId = preference.id;

                })
                .catch();

            return plan
        }))

        res.render("plans", { plans: currentPlans })
    }
    static async hasActivePlan(req, res, next) {
        const user = {
            id: req.params.id,
            token: req.params.wtj,
        };

        const hasActivePlan = await ClientsPlans.findOne({ where: { clientId: user.id } })
        console.log(hasActivePlan)

        if (hasActivePlan) {
            next()
        } else {
            plansController.renderPlans(req, res)
        }

    }
    static async PaymentWebhookHandler(req, res) {
        await fetch(`https://api.mercadopago.com/v1/payments/${req.body.data.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer TEST-1518391375042209-031618-771d1f999699cb8e15b268d22961eff1-2329930160'
            },
        }).then((response) => {
            return response.json()
        }).then(async (res) => {
            await ClientsPlans.create({ serviceId: res.metadata.plan_id, clientId: res.metadata.user_id })
            await Clients.update({ wasPurchased: 1 }, { where: { id: res.metadata.user_id } })
        })
        res.json({ result: "plano contratado com sucesso" })
    }
}