import mysql from "mysql";
import "dotenv/config";
import { Sequelize } from "sequelize";
var db = JSON.parse(process.env["db"]);

export const dataBase = new Sequelize(db.host, db.user, db.password, {
  host: db.ip,
  dialect: "mysql",
  dialectoptions: {
    ssl: { rejectUnauthorized: true },
  },
});

// Testa a conexão e imprime informações do banco
(async () => {
  try {
    await dataBase.authenticate();
    console.log("✅ Conectado ao banco de dados:", dataBase.getDatabaseName());
    console.log("🔗 Host:", dataBase.config.host);
    console.log("📦 Dialeto:", dataBase.getDialect());
  } catch (error) {
    console.error("❌ Erro na conexão com o banco:", error);
  }
})();
