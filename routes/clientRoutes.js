import express from "express";
export const router = express.Router();
import { ServerController } from "../controllers/ServerController.js";

router.get("/register", ServerController.registerPage);
router.post("/register", ServerController.createUser);
router.get("/read/:id", ServerController.readUser);
router.post("/update/:id", ServerController.updateUser);
router.get("/login", ServerController.loginView);
router.post("/login", ServerController.loginUser);
router.get("/user/:id/:wtj", ServerController.loggedClient)
router.post("/user/:id/:wtj",ServerController.authClient)
