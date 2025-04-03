import { ClientsPlans } from "../models/ClientsPlans.js";
import { ServicePlans } from "../models/ServicePlans.js";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'TEST-1518391375042209-031618-771d1f999699cb8e15b268d22961eff1-2329930160' });
const preference = new Preference(client);
let plans = await ServicePlans.findAll({ raw: true })


for (const plan of plans) {
    const pref = await preference.create({
        body: {
            items: [
                {
                    title: plan.name,
                    quantity: 1,
                    unit_price: Math.floor(plan.price)
                }
            ],
        }
    })
        .then((preference) => {
            plan.preferenceId = preference.id;

        })
        .catch();

}

export class plansController {

    static async renderPlans(req, res) {

        res.render("plans", { plans: plans })
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
        const user = {
            planId: req.body.planId,
            clientId: req.body.clientId,
        }

        console.log(req.body)

        const newPlanContracted = await ClientsPlans.create({ serviceId: user.planId, clientId: user.clientId })

        res.json({ result: "plano contratado com sucesso" })
    }
}