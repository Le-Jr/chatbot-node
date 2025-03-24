const button = document.querySelector("#prompt");
const modal = document.querySelector("#modal");
const buttonClose = document.querySelector("#botaoFechar");
const form = document.querySelector("form");
const gerarPrompt = document.getElementById("gerar-prompt");
const loadingPrompt = document.getElementById("loading-gerar-prompt");

button.addEventListener("click", (e) => {
  console.log("Cliquei aqui");
  modal.showModal();
});

buttonClose.addEventListener("click", () => {
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
    modal.style.display = "flex";
    document.getElementById("promptGerado").innerText = result.prompt;
    document.querySelector(".promptInput").value = result.prompt;
    modal.innerHTML = `<button type="button" id="botaoFechar" class="btn-cancel">`;
  }, 4000);
});
