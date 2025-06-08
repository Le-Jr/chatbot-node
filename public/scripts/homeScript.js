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

const getClientId = async () => {
  try {
    const storage = localStorage;
    const full_json = storage.getItem("mercurioChatUser");
    clean_json = JSON.parse(full_json);
    const token = clean_json.token;
    // console.log(`Token do baguio: ${clean_json.token}`);
    // console.log(`ID DO CABA: ${clean_json.id}`);
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch("https://client.mercuriochat.com.br/user/getClientId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: clean_json.id }), // ID do cliente, ajuste conforme necessário
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data.client_id;
  } catch (err) {
    console.error("Erro ao obter client_id:", err);
    errorText = "Não foi possível obter o client_id";
    showError();
    return null;
  }
};

const apiTest = async () => {
  try {
    const response = await fetch("https://api.mercuriochat.com.br/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    } else {
      console.log("Deu bom nas requisição");
    }
  } catch (err) {
    console.error("Erro na requisição: ", err);
  }
};

apiTest();

const sendConfigFiles = (client_id) => {
  const send = document.querySelector("#submitFile");
  const configFile = document.querySelector("#file");

  send.addEventListener("click", async () => {
    if (!configFile) {
      showError("Elemento de arquivo não encontrado");
      return;
    }

    if (!configFile.files || configFile.files.length === 0) {
      showError("Por favor, selecione um arquivo PDF ou CSV");
      return;
    }

    const file = configFile.files[0];
    const allowedExtensions = ["pdf", "csv"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      showError("Apenas arquivos PDF ou CSV são permitidos");
      return;
    }

    client_id = await getClientId();

    if (!client_id) {
      showError("Client ID não fornecido");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("client_id", client_id);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://api.mercuriochat.com.br/processar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Arquivo enviado com sucesso:", result);
    } catch (error) {
      showError("Erro ao enviar o arquivo");
      console.error("Erro ao enviar o arquivo:", error);
    }
  });
};

const init = async () => {
  const client_id = await getClientId();
  if (client_id) {
    sendConfigFiles(client_id);
  }
};

init();

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
      return response.json();
    })
    .then((data) => {
      const currentUser = data.currentUser;
      if (
        currentUser.config !== textareas[0].value ||
        currentUser.faq !== textareas[1].value
      ) {
        if (currentUser.config !== textareas[0].value) {
          errorText = "Salve as alterações do Prompt antes de iniciar";
        } else {
          errorText = "Salve as alterações da mensagem inicial antes de iniciar";
        }
        showError();
        return false;
      }
      return true;
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
      errorText = "Erro ao verificar alterações. Tente novamente.";
      showError();
      return false;
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
