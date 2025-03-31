import { DataTypes } from "sequelize";
import { dataBase } from "../db/conn.js";
import { Clients } from "./Clients.js";
import { ServicePlans } from "./ServicePlans.js";


export const ClientsPlans = dataBase.define("clients_plans",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

})
ClientsPlans.belongsTo(Clients,{foreignKey: "clientId"})
ClientsPlans.belongsTo(ServicePlans,{foreignKey: "serviceId"})