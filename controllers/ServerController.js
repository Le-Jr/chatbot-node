import { raw } from "express";
import { Clients } from "../models/Clients.js";
import bcrypt from "bcrypt";

export class ServerController {
  static async initialPage(req, res) {
    const clients = await Clients.findAll({ raw: true });

    res.render("clients", { clients });
    console.log("Got heree!");
  }

  static registerPage(req, res) {
    res.render("register");
  }

  static async createUser(req, res) {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: password,
    };

    console.log(user);

    await Clients.create(user);

    res.redirect("/client");
  }

  static async readUser(req, res) {
    const id = req.params.id;
    const client = await Clients.findOne({ where: { id: id }, raw: true });

    res.render("readClients", { client });
  }

  static async updateUser(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const faq = req.body.faq;
    const prompt = req.body.prompt;

    let client = await Clients.update(
      { name: name, email: email, faq: faq, config: prompt },
      { where: { id: id } }
    );

    client = await Clients.findOne({ where: { id: id }, raw: true });
    console.log("Esse é o cliente: ", client);
    res.render("readClients", { client });
  }
}
