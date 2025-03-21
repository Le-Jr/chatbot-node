import { dataBase } from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Clients } from "./Clients.js";

export const Wjt = dataBase.define('Wjt', {
    wtjId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    }
  }
);
  
Wjt.belongsTo(Clients, { foreignKey: "clientId" });
