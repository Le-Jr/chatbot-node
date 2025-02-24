import express from "express";
export const router = express.Router();
import { ServerController } from "../controllers/ServerController.js";

router.get("/", ServerController.initialPage);
router.get("/register", ServerController.registerPage);
router.post("/register", ServerController.createUser);
router.get("/:id", ServerController.readUser);
router.post("/:id", ServerController.updateUser);
