import { dataBase } from "../db/conn.js";
import { DataTypes } from "sequelize";

export const Clients = dataBase.define(
  "clients",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    // role: DataTypes.ENUM,
    phoneNumber: DataTypes.STRING,
    sessionPath: DataTypes.STRING,
    config: DataTypes.JSON,
    qrCode: DataTypes.TEXT,
    faq: DataTypes.TEXT,
  },
  {
    timestamps: false,
  }
);
