import mongoose from "mongoose";
import "dotenv/config";

const mongo = process.env["MONGO_URI"];

connectMongo().catch((err) => {
  console.log("Error connecting: ", err);
});

async function connectMongo() {
  await mongoose.connect(mongo);

  const clientSchema = mongoose.Schema({
    clientId: String,
    phoneNumber: Number,
    sessionPath: String,
    config: Object({
      companyName: String,
      FAQ: String,
    }),
  });

  const Client = mongoose.model("Client", clientSchema);

  const doce = new Client({
    clientId: "doce-cia",
    phoneNumber: 5521981265872,
    sessionPath: "Teste",
    config: {
      companyName: "Doce e Cia",
      FAQ: "Abrimos as 08:00h",
    },
  });

  await doce.save();
  return console.log(
    `Criado com sucesso: ID:${doce.clientId} config: ${doce.config.companyName} `
  );

  //   const testeSchema = mongoose.Schema({
  //     name: String,
  //   });

  //   const Teste = mongoose.model("Teste", testeSchema);
  //   const leandro = new Teste({ name: "Leandro" });
  //   await leandro.save();
  //   return console.log("Adicionado com sucesso: ", leandro.name);
}
