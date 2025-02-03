import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { Client } from "../src/models/Client.js";
import mongoose from "mongoose";

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
mongoose.connect(process.env["MONGO_URI"]);

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const clients = await Client.find();
  // console.log(clients);
  res.render("clients", { clients });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Errror connecting");
  }
  console.log(`Server running on the port ${port}`);
});
