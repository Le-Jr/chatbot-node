import { dataBase } from "../db/conn.js";
import { DataTypes } from "sequelize";

export const Clients = dataBase.define(
    'clients', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    sessionPath: DataTypes.STRING,
    config: DataTypes.JSON,
    qrCode: DataTypes.TEXT
}, {
    timestamps: false
});

