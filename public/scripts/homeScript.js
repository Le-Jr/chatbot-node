let actionType;
const loading = document.querySelector(".loading");
const loadingText = document.getElementById("loadingWarning");
const textareas = document.querySelectorAll("textarea");
const success = document.querySelector(".success-message");
const regress = document.querySelector(".regress-bar");
const errorMessage = document.querySelector(".error-message");

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
    return false;
  } else {
    console.log("Todos os textareas estão preenchidos.");
    return true;
  }
}

function compareTextareas() {
  fetch(`/user/${user.id}/${user.token}`, {
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
      return (currentUser = response.json());
    })
    .then((data) => {
      const currentUser = data.currentUser;
      if (currentUser.config != textareas[0].value) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `<span class="sucess-text">Salve as alterações do prompt antes iniciar</span>`;
        return false;
      }
      if (currentUser.faq != textareas[1].value) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `<span class="sucess-text">Salve as alterações da mensagem inicial antes iniciar</span>`;
        return false;
      }
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
    });
  return true;
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

function openQrCode() {
  document.getElementById("qrCodeModal").style.display = "flex";
}

function showSucess() {
  success.style.display = "block";
  regress.style.display = "block";
  success.innerHTML = `<span class="sucess-text">O ${actionType} foi alterado com sucesso!</span>`;
  regress.style.animation = "regress 5s linear forwards";
  setTimeout(() => {
    success.style.display = "none";
    regress.style.display = "none";
    success.innerHTML = "";
    regress.style.animation = "";
  }, 5000);
}
