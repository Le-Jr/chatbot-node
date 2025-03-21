import { dataBase } from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Clients } from "./Clients.js";

export const PreviousContacts = dataBase.define("previous_contacts", {
  phoneNumber: DataTypes.STRING,
  context: DataTypes.TEXT,
});

PreviousContacts.belongsTo(Clients, { foreignKey: "clientId" });
