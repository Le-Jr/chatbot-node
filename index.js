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
import { createServer } from "http";
import { Server } from "socket.io";

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

app.use("/", router);

const clientes = await Clients.findAll({ raw: "true" });

// clientController.startClientSession(clientes);

const server = createServer(app);
export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });

  // Exemplo: Enviar uma mensagem quando alguém se conecta
  socket.emit("mensagem", "Bem-vindo ao servidor WebSocket!");
});

dataBase.sync().then(() => {
  console.log("DB Sincronizado");
  server.listen(port, (err) => {
    if (err) {
      return console.log("Erro conectando ao servidor");
    }
    console.log(`Servidor rodando na porta ${port}`);
  });
});
