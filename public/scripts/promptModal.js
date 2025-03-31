const button = document.querySelector("#prompt");
const modal = document.querySelector("#modal");
const buttonClose = document.querySelectorAll("#closeModalPrompt");
const form = document.querySelector("form");
const gerarPrompt = document.getElementById("gerar-prompt");
const loadingPrompt = document.getElementById("loading-gerar-prompt");

button.addEventListener("click", (e) => {
  modal.showModal();
});

buttonClose[1].addEventListener("click", () => {
  console.log("Cliquei no fechar");
  modal.close();
});

gerarPrompt.addEventListener("click", () => {
  console.log("Cliquei no gerar");
  loadingPrompt.style.display = "flex";
  form.style.display = "none";
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

  loadingPrompt.style.display = "none";

  const result = await response.json();
  showSucess("Prompt gerado com sucesso!");
  modal.style.display = "none";
  setTimeout(() => {
    buttonClose[0].style.display = "block";
    buttonClose[0].addEventListener("click", () => {
      modal.close();
      modal.style.display = "none";
    });
    modal.style.display = "flex";
    document.getElementById("promptGerado").innerText = result.prompt;
    document.querySelector(".promptInput").value = result.prompt;
  }, 2000);
});
