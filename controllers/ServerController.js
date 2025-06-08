import { raw } from "express";
import { Clients } from "../models/Clients.js";
import bcrypt from "bcrypt";
import { clientController } from "./clientController.js";
import { Wjt } from "../models/Wtj.js";
import "../config/googleAuth.js";
import passport from "passport";
import axios from "axios";
import "dotenv";
import { OpenAI } from "openai";

export class ServerController {
  static async initialPage(req, res) {
    res.render("home");
  }

  static registerPage(req, res) {
    res.render("register", { error: "Por enquanto nada", verifyClient: false });
  }

  static async createUser(req, res) {
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: password,
      };
      const verifyClient = await Clients.findOne({
        where: { email: user.email },
      });
      if (verifyClient) {
        return res.render("register", {
          error: "Email já cadastrado",
          verifyClient: true,
        });
      }

      await Clients.create(user);
      const newClient = await Clients.findOne({
        raw: true,
        where: { email: user.email },
      });
      const newWtj = await Wjt.create({ clientId: newClient.id });

      res.redirect(`/user/${newClient.id}/${newWtj.wtjId}`);
    } catch (err) {
      console.log("Erro na criação: ", err);
    }
  }

  static async updatePromptUser(req, res) {
    const user = req.body;
    try {
      await Clients.update({ config: user.prompt }, { where: { id: user.id } });
      res.json(true);
    } catch {
      res.json(false);
    }
  }
  static async updateFaqUser(req, res) {
    const user = req.body;
    try {
      await Clients.update({ faq: user.faq }, { where: { id: user.id } });
      res.json(true);
    } catch {
      res.json(false);
    }
  }
  static async loginView(req, res) {
    res.render("login", { error: false });
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
        res.render("login", { error: true });
      }
    });

    // await clientController.startClientSession(res,{currentUser})
  }
  static async loggedClient(req, res) {
    
    res.render("logged");
  }
  static async getClient(req, res) {
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
  static async authClient(req, res, next) {
    const user = {
      id: req.params.id,
      token: req.params.wtj,
    };
    const auth = await Wjt.findOne({
      where: {
        clientId: user.id,
        wtjId: user.token,
      },
    });

    if (auth) {
      next();
    } else {
      res.status(401).send();
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

      let existingUser = await Clients.findOne({
        where: { googleId: googleId },
      });

      let token = await Wjt.findOne({
        where: { clientId: existingUser.id },
      });

      if (!token) {
        await Wjt.create({ clientId: existingUser.id });
        token = await Wjt.findOne({
          where: { clientId: existingUser.id },
        });
      }

      res.redirect(`/user/${existingUser.id}/${token.wtjId}`);
    } catch (err) {
      console.error("Erro no callback do Google: ", err);
      res.status(500).send("Erro na autenticação com o google 🤒");
    }
  }

  static async generatePrompt(req, res) {
    

    const { company_name, segment, tone, type_service, faq, time } = req.body;

    const prompt = `
    Você é um assistente virtual da empresa ${company_name}, que atua no ramo de ${segment}. O objetivo do assistente é fornecer um atendimento de qualidade, eficiente e amigável para os clientes.

**Informações importantes para o assistente:**
- **Nome da empresa:** ${company_name}
- **Ramo de atuação:** ${segment}
- **Tom:** ${tone}
- **Tipo de atendimento:** ${type_service}
- **FAQ:** ${faq}
- **Horário de funcionamento:** ${time}

O assistente deve seguir o tom escolhido e fornecer respostas claras e úteis sobre os produtos, serviços e dúvidas comuns. A comunicação deve ser amigável e eficiente. 

### Instruções:
Em vez de simplesmente fornecer uma resposta como se fosse uma conversa, você deve gerar um **prompt para um assistente de IA** que pode ser utilizado para simular o atendimento ao cliente dessa empresa. O prompt gerado deve ser focado em simular um atendimento, considerando o perfil da empresa, tom e as informações fornecidas. 

Exemplo de como o assistente pode responder:
"Olá! Bem-vindo! Como posso te ajudar hoje? Fique à vontade para perguntar sobre nossos serviços ou produtos, e farei o meu melhor para te ajudar a encontrar o que você procura."


Seu objetivo é sempre gerar prompts com base nas informações fornecidas, que simulem um atendimento amigável e eficiente.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: { Authorization: `Bearer ${process.env.OPEN_AI_KEY}` },
        }
      );

      const promptGerado = response.data.choices[0].message.content;
      res.json({ prompt: promptGerado });
    } catch (err) {
      console.error("Erro ao processar a resposta: ", err);
    }
  }
}
