import express from "express";
export const router = express.Router();
import { ServerController } from "../controllers/ServerController.js";

router.get("/register", ServerController.registerPage);
router.post("/register", ServerController.createUser);
router.get("/read/:id", ServerController.readUser);
router.post("/read/:id", ServerController.updateUser);
router.get("/login", ServerController.loginView);
router.post("/login", ServerController.loginUser);
router.get("/session", (req, res) => {
  res.json(req.user || { message: "Nenhum usuário logado!" });
});

// Rotas Google OAuth
router.get("/auth/google", ServerController.googleAuth);
router.get("/auth/google/callback", ServerController.googleCallback);
router.get("/sucesso", ServerController.googleSucess);

// Rotas Autenticação
router.get("/user/:id/:wtj", ServerController.loggedClient);
router.post("/user/:id/:wtj", ServerController.authClient);
