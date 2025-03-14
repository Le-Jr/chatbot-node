const buttonForNewSession = document.querySelector(".newSessionButton");
const qrCode = document.querySelector('.qrCodeDiv')




buttonForNewSession.addEventListener("click", () => {
  console.log("clickei no teu botão 🌚");
  fetch(`/user/${user.id}/${user.token}/createSession`, {
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
      console.log(data.qrCode)
      qrCode.innerHTML=`<img src="${data.qrCode}">`
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
    });
});
