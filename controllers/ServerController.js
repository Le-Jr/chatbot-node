import { raw } from "express";
import { Clients } from "../models/Clients.js";

export class ServerController {
  static async initialPage(req, res) {
    const clients = await Clients.findAll({ raw: true });

    res.render("clients", { clients });
    console.log("Chegou aqui");
    // res.send("Hello world!");
  }

  static registerPage(req, res) {
    res.render("register");
  }

  static async createUser(req, res) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    console.log(user);

    await Clients.create(user);

    res.redirect("/client");
  }
}
