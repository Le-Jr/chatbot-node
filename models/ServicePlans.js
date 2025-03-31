import { DataTypes } from "sequelize";
import { dataBase } from "../db/conn.js";

export const ServicePlans = dataBase.define("service_plans", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    days: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2)
}, { timestamps: false })

