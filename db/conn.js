import { Sequelize } from "sequelize";
import "dotenv/config";


export const dataBase = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    logging: false, // Desativa logs SQL se quiser
  }
);
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

