const buttonForNewSession = document.querySelector(".newSessionButton");
const qrCode = document.querySelector(".qrCodeDiv");
const progressContainer = document.querySelector(".progressContainer");
const progressWarning = document.querySelector(".progressWarning");
const expiredMessage = document.querySelector(".expiredMessage");
const regenerateButton = document.getElementById("regenerateButton");
const closeQrDiv = document.querySelector("#close-qr-div");
let isPersistentSession = localStorage.getItem("isPersistentSession");

window.addEventListener("load", () => {
  fetchUserData();
  if (sessionStorage.getItem("regenerateSession") === "true") {
    sessionStorage.removeItem("regenerateSession");
    console.log("Regenerando sessão automaticamente");
    buttonForNewSession.click();
  }
});

regenerateButton.addEventListener("click", () => {
  openQrCode();
  createQrCode();
});

buttonForNewSession.addEventListener("click", async (event) => {
  event.preventDefault();

  if (
    buttonForNewSession.classList.contains("disabled") &&
    observedUser.isActiveSession === false
  ) {
    changeSessionButton("enable");
  }

  if (!validateTextareasEmpty()) return;

  await fetchUserData();
  const resultado = await compareTextareas();

  if (!resultado) return;

  const isButtonEnabled = !buttonForNewSession.classList.contains("disabled");

  if (isPersistentSession !== "true" && isButtonEnabled) {
    console.log("Sessão não persistente, exibindo QR code.");
    openQrCode();
    createQrCode();
  } else if (isPersistentSession === "true" && isButtonEnabled) {
    console.log("Sessão persistente detectada, conectando automaticamente.");

    user.isPersistentSession = true;

    try {
      await fetch(`/user/${user.id}/${user.token}/createSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      changeSessionButton("disabled");
      showSucess("Device reconectado!");
    } catch (error) {
      console.error("Erro ao reconectar sessão persistente:", error);
    }
  } else {
    try {
      await fetch(`/user/${user.id}/${user.token}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      changeSessionButton("enable");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }
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
    console.log(user);
    console.log("Clicou no botão para nova sessão.");

    try {
      const response = await fetch(`/user/${user.id}/${user.token}/createSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Erro na requisição");

      const data = await response.json();

      qrCode.innerHTML = `<img src="${data.qrCode}">`;
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
    } catch (error) {
      console.error("Erro ao criar sessão com QR Code:", error);
      if (loading) loading.style.display = "none";
      if (loadingText) loadingText.style.display = "none";
    }
  });

  socket.on("message", (message) => {
    if (message === "usuário escaneou o qr code") {
      showSucess("Device conectado!");
      closeQrDiv.click();
      changeSessionButton("disabled");
      localStorage.setItem("isPersistentSession", "true");
      isPersistentSession = localStorage.isPersistentSession;
      socket.close();
    }
  });
}
