import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { Clients } from "../models/Clients.js";
import { dataBase } from "./db/conn.js";

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
// mongoose.connect(process.env["MONGO_URI"]);

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

console.log("ai calica");

dataBase
  .sync()
  .then(() => console.log("Tabela Products sincronizada"))
  .catch((err) => console.error("Erro ao sincronizar a tabela:", err));
app.listen(3000, () => {});

const client = express.Router();
app.use("/client", client);

app.get("/", async (req, res) => {
  const clients = await Client.find();
  // console.log(clients);
  res.render("clients", { clients });
});

client.get("/:clientId", async (req, res) => {
  const client = await Client.findOne({ clientId: req.params.clientId });
  console.log("Route id: ", req.params["clientId"]);

  res.render("clientNew", { client });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Error connecting");
  }
  console.log(`Server running on the port ${port}`);
});
