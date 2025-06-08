const buttonForNewSession = document.querySelector(".newSessionButton");
const buttonForNewSessionStatus = document.querySelector(".newSessionButton").classList;

const qrCode = document.querySelector(".qrCodeDiv");
const progressContainer = document.querySelector(".progressContainer");
const progressWarning = document.querySelector(".progressWarning");
const expiredMessage = document.querySelector(".expiredMessage");
const regenerateButton = document.getElementById("regenerateButton");
const closeQrDiv = document.querySelector("#close-qr-div");
let isPersistentSession = localStorage.getItem("isPersistentSession");

window.addEventListener("load", async () => {
  let currentUser = await fetchUserData();
  if (currentUser.isActiveSession) {
    changeSessionButton("disabled");
  }
});

// regenerateButton.addEventListener("click", () => {
//   openQrCode("generating qr code");
//   createQrCode();
// });

buttonForNewSession.addEventListener("click", async (event) => {
  event.preventDefault();

  if (!validateTextareasEmpty()) {
    return console.log("áreas incompletas");
  }

  let currentUser = await fetchUserData();

  if (compareTextareas() && !buttonForNewSessionStatus.contains("disabled")) {
    console.log(currentUser.isActiveSession);
    openLoadScreen("generating qr code");
    createQrCode();
    return;
  }

  await fetch(`/user/${user.id}/${user.token}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(async (response) => {
      console.log(await response.json());
    })
    .catch((error) => {
      console.log(error);
    });
  changeSessionButton("enable");
});

async function createQrCode() {
  if (loading) {
    loading.style.display = "flex";
    progressContainer.style.display = "none";
    progressWarning.style.display = "none";
    expiredMessage.style.display = "none";
    regenerateButton.style.display = "none";
  }

  if (loadingText) {
    loadingText.style.display = "flex";
  }

  const socket = await io("https://client.mercuriochat.com.br");

  socket.on("connect", async () => {
    user.wsId = socket.id;
    fetch(`/user/${user.id}/${user.token}/createSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        console.log("Resposta recebida:", response);
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.qrCode);

        qrCode.innerHTML = `<img src="${data.qrCode}" />`;
        qrCode.style.display = "flex";

        progressContainer.style.display = "block";
        progressWarning.style.display = "flex";

        if (loading) loading.style.display = "none";
        if (loadingText) loadingText.style.display = "none";

        setTimeout(() => {
          qrCode.innerHTML = "";
          qrCode.style.display = "none";
          if (expiredMessage) expiredMessage.style.display = "block";
          if (regenerateButton) regenerateButton.style.display = "block";
        }, 60000);
      })
      .catch((error) => {
        console.error("Erro ao criar sessão com QR Code:", error);
        if (loading) loading.style.display = "none";
        if (loadingText) loadingText.style.display = "none";
      });
  });

  socket.on("message", (message) => {
    if (message === "usuário escaneou o qr code") {
      showSucess("Device conectado!");
      closeQrDiv.click();
      changeSessionButton("disabled");
      localStorage.setItem("isPersistentSession", "true");
      isPersistentSession = localStorage.getItem("isPersistentSession");
      socket.disconnect();
    }
  });
}
