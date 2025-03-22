const path = window.location.pathname;
const pathLocate = path.split("/");
let user = {
  id: pathLocate[2],
  token: pathLocate[3],
};

let promptInput = document.querySelector(".promptInput");
const updatePromptButton = document.querySelector(".updatePromptButton");

let faqInput = document.querySelector(".faqInput");
const updateFaqButton = document.querySelector(".updateFaqButton");

let controlButtonSession = document.querySelector(".newSessionButton");
let mercurio = controlButtonSession.querySelector("img");
let iniciaSessao = document.querySelector(".inicia-sessao");
let textSessao = iniciaSessao.querySelector("h2");

localStorage.setItem("mercurioChatUser", JSON.stringify(user));

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
    console.log("Resposta do servidor:", data);
    const currentUser = data.currentUser;
    if (currentUser.config != undefined) {
      promptInput.value = data.currentUser.config;
    }
    if (currentUser.faq != undefined) {
      faqInput.value = data.currentUser.faq;
    }
    if (currentUser.isActiveSession) {
      controlButtonSession.classList.add("disabled");
      mercurio.style.border = "none";
      mercurio.src = "/assets/mercurioWhite.svg";
      textSessao.style.color = "var(--error-color)";
      textSessao.textContent = "Encerrar MercurioChat";
    }
  })
  .catch((error) => {
    console.error("Erro ao fazer a requisição:", error);
  });

function confirmAction() {
  if (actionType == "Prompt") {
    //Prompt Update
    promptInput = document.querySelector(".promptInput");
    user.prompt = promptInput.value;
    fetch(`/promptUpdate/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        closeModal();
        showSucess("Prompt atualizado com sucesso!");
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        return (currentUser = response.json());
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao fazer a requisição:", error);
      });
  }
  //});
  else if (actionType == "FAQ") {
    // Faq update
    faqInput = document.querySelector(".faqInput");
    user.faq = faqInput.value;
    fetch(`/faqUpdate/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .catch((error) => {
        console.error("Erro ao fazer a requisição:", error);
      })
      //})
      .then((response) => {
        closeModal();
        showSucess("Faq atualizado com sucesso!");
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        return (currentUser = response.json());
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao fazer a requisição:", error);
      });
  }
}
