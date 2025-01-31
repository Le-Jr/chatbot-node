import express from "express";
import "dotenv/config";
import { create, start } from "./src/whatsapp_conn.js";

const app = express();
const port = 3000;
const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

app.get("/", (req, res) => {
  res.send("Olá mundo");
});

app.post("/webhook", (req, res) => {
  create();
  start();
});

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
