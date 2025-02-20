import express from "express";
export const router = express.Router();
import { ServerController } from "../controllers/ServerController.js";

router.get("/", ServerController.initialPage);
router.get("/register", ServerController.registerPage);
