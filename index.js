import "dotenv/config";

import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { dataBase } from "./db/conn.js";
import { Clients } from "./models/Clients.js";
import { clientController } from "./controllers/clientController.js";
import { PreviousContacts } from "./models/PreviousContacts.js";
import { router } from "./routes/clientRoutes.js";

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

dataBase.sync();

app.use("/client", router);

const clientes = await Clients.findAll({ raw: "true" });

clientController.startClientsSessions(clientes);

app.listen(port, (err) => {
  if (err) {
    return console.log("Errror connecting");
  }
  console.log(`Server running on the port ${port}`);
});
