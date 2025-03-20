const buttonForNewSession = document.querySelector(".newSessionButton");
const qrCode = document.querySelector(".qrCodeDiv");
const progressContainer = document.querySelector(".progressContainer");
const progressWarning = document.querySelector(".progressWarning");
const expiredMessage = document.querySelector(".expiredMessage");
const regenerateButton = document.getElementById("regenerateButton");
const stopRequestButton = document.getElementById("close-qr-div");

//let controller = null;

buttonForNewSession.addEventListener("click", (event) => {
  //controller = new AbortController();
  //const { signal } = controller;
  event.preventDefault();
  validateTextareasEmpty();
  if (validateTextareasEmpty()) {
    compareTextareas();
    if (compareTextareas()) {
      openQrCode();
      createQrCode();
    }
  } else {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `<span class="sucess-text">Salve as alterações da mensagem inicial antes iniciar</span>`;
  }
});

function createQrCode() {
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

  console.log("clickei no teu botão 🌚");
  fetch(`/user/${user.id}/${user.token}/createSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    //signal,
  })
    .then((response) => {
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
        if (expiredMessage) expiredMessage.style.display = "block";
        if (regenerateButton) regenerateButton.style.display = "block";
      }, 60000);
    })
    .catch((error) => {
      /* if (error.name === "AbortError") {
        console.log("Requisição interrompida pelo usuário.");
      } else {
        console.error("Erro ao fazer a requisição:", error);
      }
    })
    .finally(() => {*/
      if (loading) {
        loading.style.display = "none";
      }
      if (loadingText) {
        loadingText.style.display = "none";
      }
    });
  /*if (stopRequestButton) {
  stopRequestButton.addEventListener("click", () => {
    if (controller) {
      controller.abort();
      console.log("Requisição interrompida.");
      controller = null;
    }
  });
}*/
  if (regenerateButton) {
    regenerateButton.addEventListener("click", () => {
      buttonForNewSession.click(); // Simula clique no botão original para reaproveitar o código
    });
  }
}
