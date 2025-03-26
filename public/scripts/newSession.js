const buttonForNewSession = document.querySelector(".newSessionButton");
const qrCode = document.querySelector(".qrCodeDiv");
const progressContainer = document.querySelector(".progressContainer");
const progressWarning = document.querySelector(".progressWarning");
const expiredMessage = document.querySelector(".expiredMessage");
const regenerateButton = document.getElementById("regenerateButton");
const closeQrDiv = document.querySelector("#close-qr-div");

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
    buttonForNewSession.classList == "newSessionButton disabled" &&
    observedUser.isActiveSession == false
  ) {
    changeSessionButton("enable");
  }
  if (validateTextareasEmpty()) {
    console.log("vou chamar hein");
    await fetchUserData();
    const resultado = compareTextareas();
    console.log(observedUser.config + " teste");

    if (resultado) {
      console.log(resultado);
      openQrCode();
      createQrCode();
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

  socket.on("connect", (data) => {
    user.wsId = socket.id;
    console.log(user);
    console.log("clickei no teu botão 🌚");
    fetch(`/user/${user.id}/${user.token}/createSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        console.log(" Resposta recebida:", response);
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.qrCode);

        qrCode.innerHTML = `<img src="${data.qrCode}">`;
        qrCode.style.display = "flex";

        progressContainer.style.display = "block";
        progressWarning.style.display = "flex";

        if (loading) {
          loading.style.display = "none";
        }
        if (loadingText) {
          loadingText.style.display = "none";
        }

        setTimeout(() => {
          qrCode.innerHTML = "";
          qrCode.style.display = "none";
          if (expiredMessage) expiredMessage.style.display = "block";
          if (regenerateButton) regenerateButton.style.display = "block";
        }, 60000);
      })
      .catch((error) => {
        if (loading) {
          loading.style.display = "none";
        }
        if (loadingText) {
          loadingText.style.display = "none";
        }
      });
  });
  //vocÊ recebera aqui caso o qr seja lido
  socket.on("message", (message) => {
    if (message === "usuário escaneou o qr code") {
      showSucess("Device conectado!");
      closeQrDiv.click();
      changeSessionButton("disabled");
      socket.close();
    }
  });
}
