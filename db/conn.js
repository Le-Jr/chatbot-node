import mysql from "mysql";
import "dotenv/config";
import { Sequelize } from "sequelize";
var db = JSON.parse(process.env["db"]);

export const dataBase = new Sequelize(db.host, db.user, db.password, {
  host: "34.151.210.8",
  dialect: "mysql",
  dialectoptions: { ssl: { rejectUnauthorized: true } },
});
