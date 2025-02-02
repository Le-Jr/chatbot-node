import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Errror connecting");
  }
  console.log(`Server running on the port ${port}`);
});
