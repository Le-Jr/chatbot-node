const button = document.querySelector("#prompt");
const modal = document.querySelector("#modal");
const buttonClose = document.querySelector("#botaoFechar");
const form = document.querySelector("form");

button.addEventListener("click", (e) => {
  console.log("Cliquei aqui");
  modal.showModal();
});

buttonClose.addEventListener("click", () => {
  console.log("Cliquei no fechar");
  modal.close();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/promptGenerate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById("promptGerado").innerText = result.prompt;
  document.querySelector(".promptInput").value = result.prompt;
});
