const path = window.location.pathname;
const pathLocate = path.split("/");
const user = {
  id: pathLocate[3],
  token: pathLocate[4],
};

let promptInput = document.querySelector(".promptInput");
const updatePromptButton = document.querySelector(".updatePromptButton");

let faqInput = document.querySelector(".faqInput");
const updateFaqButton = document.querySelector(".updateFaqButton");

// "/client/user/5/c3eceaf9-636f-43ee-a0fb-bae4c69f583b"
localStorage.clear();
localStorage.setItem("user", JSON.stringify(user));

console.log("charlie brow");

fetch(`/client/user/${user.id}/${user.token}`, {
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
    return currentUser = response.json();
  })
  .then((data) => {
    console.log("Resposta do servidor:", data);
    const currentUser = data.currentUser;
    if (currentUser.config != undefined) {
      promptInput.value = data.currentUser.config
    }
    if (currentUser.faq != undefined) {
      faqInput.value = data.currentUser.faq
    }
  })
  .catch((error) => {
    console.error("Erro ao fazer a requisição:", error);
  });

updatePromptButton.addEventListener("click", () => {

  promptInput = document.querySelector(".promptInput");
  user.prompt = promptInput.value
  fetch(`/promptUpdate/${user.id}`, {
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
      return currentUser = response.json();
    })
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
    });
})

updateFaqButton.addEventListener("click", () => {

  faqInput = document.querySelector(".faqInput");
  user.faq = faqInput.value
  fetch(`/faqUpdate/${user.id}`, {
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
      return currentUser = response.json();
    })
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
    });
})

