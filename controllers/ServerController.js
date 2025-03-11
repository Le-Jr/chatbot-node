import { raw } from "express";
import { Clients } from "../models/Clients.js";
import bcrypt from "bcrypt";
import { clientController } from "./clientController.js";
import { Wjt } from "../models/Wtj.js";
import "../config/googleAuth.js";
import passport from "passport";

export class ServerController {
  static async initialPage(req, res) {
    res.render("home");
  }

  static registerPage(req, res) {
    res.render("register");
  }

  static async createUser(req, res) {
    // console.log("Nome: ", req.body.name);
    // console.log("Email: ", req.body.email);
    // console.log("Senha: ", req.body.password);
    const password = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: password,
    };

    await Clients.create(user);

    res.redirect("/client");
  }

  static async readUser(req, res) {
    console.log(req.params);
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
    res.render("readClients", { client });
  }
  static async loginView(req, res) {
    res.render("login");
  }
  static async loginUser(req, res) {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const currentUser = await Clients.findOne({
      raw: true,
      where: { email: user.email },
    });
    bcrypt.compare(user.password, currentUser.password, async (err, result) => {
      if (result) {
        let token = await Wjt.findOne({
          where: {
            clientId: currentUser.id,
          },
        });
        if (token) {
          res.redirect(`user/${currentUser.id}/${token.wtjId}`);
        } else {
          await Wjt.create({ clientId: currentUser.id });
          token = await Wjt.findOne({
            where: {
              clientId: currentUser.id,
            },
          });
          res.redirect(`user/${currentUser.id}/${token.wtjId}`);
        }
      } else {
        res.status(404).send("Usuário não encontrado");
      }
    });

    // await clientController.startClientSession(res,{currentUser})
  }
  static async loggedClient(req, res) {
    res.render("logged");
  }
  static async authClient(req, res) {
    const user = await req.body;
    const teste = await Wjt.findOne({
      where: {
        clientId: user.id,
        wtjId: user.token,
      },
    });
    if (teste) {
      const currentUser = await Clients.findOne({ where: { id: user.id } });
      res.json({ currentUser: currentUser });
    } else {
      res.json(false);
    }
  }

  static googleAuth = passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  });

  static async googleCallback(req, res, next) {
    try {
      const user = req.user;
      const googleId = user.googleId;
      console.log("Google ID: ", googleId);

      let existingUser = await Clients.findOne({
        where: { googleId: googleId },
      });

      // if (!existingUser) {
      //   // Se o usuário não existir, cria um novo
      //   const [newUser] = await Clients.findOrCreate({
      //     where: { googleId: user.id },
      //     defaults: {
      //       name: user.displayName, // Nome do Google
      //       email: user.email || "", // Email do Google
      //     },
      //   });

      //   existingUser = newUser;
      // }

      let token = await Wjt.findOne({
        where: { clientId: existingUser.id },
      });

      if (!token) {
        await Wjt.create({ clientId: existingUser.id });
        token = await Wjt.findOne({
          where: { clientId: existingUser.id },
        });
      }

      res.redirect(`/client/user/${existingUser.id}/${token.wtjId}`);
    } catch (err) {
      console.error("Erro no callback do Google: ", err);
      res.status(500).send("Erro na autenticação com o google 🤒");
    }
  }
}
