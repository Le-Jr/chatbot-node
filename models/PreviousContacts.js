import { dataBase } from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Clients } from "./Clients.js";

export const PreviousContacts = dataBase.define(
    'previous_contacts',
    {
        phoneNumber: DataTypes.INTEGER,
    }
)

PreviousContacts.belongsTo(Clients, { foreignKey: 'clientId' })