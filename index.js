import "dotenv/config";
import "dotenv/config";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { dataBase } from "./db/conn.js";
import { router } from "./routes/clientRoutes.js";
import { render } from "ejs";
import passport from "./config/googleAuth.js";
import session from "express-session";
import { Clients } from "./models/Clients.js";
import { PreviousContacts } from "./models/PreviousContacts.js";

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "segredo",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/client", router);
app.get("/", (req, res) => {
  res.render("home");
});

console.log("📌 Estratégias registradas no Passport:", passport._strategies);

const clientes = await Clients.findAll({ raw: "true" });

// clientController.startClientSession(clientes);

dataBase.sync().then(() => {
  console.log("DB Sincronizado");
  app.listen(port, (err) => {
    if (err) {
      return console.log("Errror connecting");
    }
    console.log(`Server running on the port ${port}`);
  });
});
