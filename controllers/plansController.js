import { ClientsPlans } from "../models/ClientsPlans.js";
import { ServicePlans } from "../models/ServicePlans.js";




export class plansController {
    static async renderPlans(req, res) {
        let plans = await ServicePlans.findAll({ raw: true })
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

        const newPlanContracted = await ClientsPlans.create({ serviceId: user.planId, clientId: user.clientId })

        res.json({result:"plano contratado com sucesso"})
    }
}