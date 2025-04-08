import mysql from "mysql";
import "dotenv/config";
import { Sequelize } from "sequelize";
var db = JSON.parse(process.env["db"]);

export const dataBase = new Sequelize(db.host, db.user, db.password, {
  host: db.ip,
  dialect: "mysql",
  dialectoptions: {
    ssl: { rejectUnauthorized: true }
  }

});
