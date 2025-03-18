import express from "express";
export const router = express.Router();
import { ServerController } from "../controllers/ServerController.js";
import { clientController } from "../controllers/clientController.js";
import passport from "passport";

router.get("/register", ServerController.registerPage);
router.post("/register", ServerController.createUser);

router.get("/", ServerController.loginView);
router.get("/login", ServerController.loginView);
router.post("/login", ServerController.loginUser);

router.post("/promptUpdate/:id", ServerController.updatePromptUser);
router.post("/faqUpdate/:id", ServerController.updateFaqUser);

router.get("/session", (req, res) => {
  res.json(req.user || { message: "Nenhum usuário logado!" });
});

// Rotas Google OAuth
router.get("/auth/google", ServerController.googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  ServerController.googleCallback
);

// Rotas Autenticação
router.get("/user/:id/:wtj",ServerController.authClient, ServerController.loggedClient);
router.post("/user/:id/:wtj", ServerController.getClient);
router.post(
  "/user/:id/:wtj/createSession",
  clientController.startClientSession
);


