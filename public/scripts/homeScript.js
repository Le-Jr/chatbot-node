const loading = document.querySelector(".loading");
let loadingText = document.getElementById("loadingWarning");
const textareas = document.querySelectorAll("textarea");
const success = document.querySelector(".success-message");
const regress = document.querySelector(".regress-bar");
const errorModal = document.querySelector(".error-message");
const errorMessage = document.querySelector(".error-message");

let actionType;
let errorText;

document.querySelectorAll("textarea").forEach((textarea) => {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});

 function validateTextareasEmpty() {
  const someEmpty = Array.from(textareas).some(
    (textarea) => textarea.value.trim() === ""
  );

  if (someEmpty) {
    console.log("Pelo menos um textarea está vazio.");
    errorText = "Verifique se não deixou algum campo em branco";
    showError();
    return false;
  } else {
    console.log("Todos os textareas estão preenchidos.");
    return true;
  }
}

 function compareTextareas() {
  return fetch(`/user/${user.id}/${user.token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na requisição");
      }
      return response.json()
    })
    .then((data) => {
      const currentUser = data.currentUser;
      if (
        currentUser.config != textareas[0].value ||
        currentUser.faq != textareas[1].value
      ) {
        if (currentUser.config != textareas[0].value) {
          errorText = "Salve as alterações do Prompt antes de iniciar";
        } else {
          errorText =
            "Salve as alterações da mensagem inicial antes de iniciar";
        }
        showError();
        return false;
      }
      return true;
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
    });
}

function openModal(type) {
  actionType = type;
  console.log(actionType);
  document.getElementById(
    "modalMessage"
  ).innerText = `Você deseja confirmar a alteração do ${type}?`;
  document.getElementById("confirmationModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("confirmationModal").style.display = "none";
  document.getElementById("qrCodeModal").style.display = "none";
  document.getElementById("error-message-modal").style.display = "none";
}

function openLoadScreen(loadText) {
  document.getElementById("qrCodeModal").style.display = "flex";
  loadingText = document.getElementById("loadingWarning");
  loadingText.textContent = loadText;
}

function showSucess(tipoAcao) {
  success.style.display = "block";
  regress.style.display = "block";
  success.innerHTML = `<span class="sucess-text"> ${tipoAcao}</span>`;
  regress.style.animation = "regress 5s linear forwards";
  setTimeout(() => {
    success.style.display = "none";
    regress.style.display = "none";
    success.innerHTML = "";
    regress.style.animation = "";
  }, 5000);
}

function showError() {
  errorModal.style.display = "block";
  regress.style.display = "block";
  errorModal.innerHTML = `<span class="sucess-text">${errorText}</span>`;
  regress.style.animation = "regress 5s linear forwards";
  setTimeout(() => {
    errorModal.style.display = "none";
    regress.style.display = "none";
    errorModal.innerHTML = "";
    regress.style.animation = "";
  }, 5000);
}

function changeSessionButton(mode) {
  if (mode == "enable") {
    controlButtonSession.classList.remove("disabled");
    mercurio.src = "/assets/mercurio.svg";
    textSessao.style.color = "var(--title-color)";
    textSessao.textContent = "Iniciar MercurioChat";
    observedUser.isActiveSession = false;
  } else if (mode == "disabled") {
    controlButtonSession.classList.add("disabled");
    mercurio.style.border = "none";
    mercurio.src = "/assets/mercurioWhite.svg";
    textSessao.style.color = "var(--error-color)";
    textSessao.textContent = "Encerrar MercurioChat";
    observedUser.isActiveSession = true;
  }
}
