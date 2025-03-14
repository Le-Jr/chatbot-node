document.querySelectorAll("textarea").forEach((textarea) => {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});

let actionType;
const loading = document.querySelector(".loading");
const loadingText = document.getElementById("loadingWarning");

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
}

function openQrCode() {
  document.getElementById("qrCodeModal").style.display = "flex";
}
