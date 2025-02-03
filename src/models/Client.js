import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env["MONGO_URI"]);

export const clientSchema = mongoose.Schema({
  clientId: { type: String, unique: true },
  phoneNumber: String,
  sessionPath: String,
  config: Object({
    companyName: String,
    FAQ: [String],
  }),
  qrCode: String,
});

export const Client = mongoose.model("Client", clientSchema);

// const doce = new Client({
//   clientId: "joao-pneu",
//   phoneNumber: 559999999,
//   sessionPath: "./src/sessions/maria-flores",
//   config: {
//     companyName: "Joao Pneu",
//     FAQ: "Abrimos as 08:00h",
//   },
//   qrCode: "teste",
// });

// await doce.save();
// console.log(
//   `Criado com sucesso: ID:${doce.clientId} config: ${doce.config.companyName} `
// );

//   const testeSchema = mongoose.Schema({
//     name: String,
//   });

//   const Teste = mongoose.model("Teste", testeSchema);
//   const leandro = new Teste({ name: "Leandro" });
//   await leandro.save();
//   return console.log("Adicionado com sucesso: ", leandro.name);
