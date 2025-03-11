const path = window.location.pathname;
const pathLocate = path.split("/");
const user = {
  id: pathLocate[3],
  token: pathLocate[4],
};
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
    return response.json();
  })
  .then((data) => {
    console.log("Resposta do servidor:", data);
  })
  .catch((error) => {
    console.error("Erro ao fazer a requisição:", error);
  });
