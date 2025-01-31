import { create, Whatsapp } from "@wppconnect-team/wppconnect";

create({
  session: "Teste",
  catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
    console.log("numeros de tentativas de ler o qrcode: ", attempts);
    console.log("terminal qrcode: ", asciiQR);
    console.log("base64 image string qrcode: ", base64Qrimg);
    console.log("urlCode (data-ref): ", urlCode);
  },
  statusFind: (statusSession, session) => {
    console.log("Status Session", statusSession);
    console.log("Session name: ", session);
  },
  headless: true,
  useChrome: true,
  devtools: false,
  logQR: true,
  updatesLog: true,
})
  .then((client) => start(client))
  .catch((err) => console.log(err));

export function start(client) {
  client.onMessage((message) => {
    if (message.body === "Oi") {
      client
        .sendText(message.from, "Olá tudo bem?")
        .then((result) => {
          console.log("Result: ", result);
        })
        .catch((err) => console.log("Error sending: ", err));
    }
  });
}

export { create };
