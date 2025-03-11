document
  .getElementById("createUserForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const loading = document.getElementById("loading");
    const formData = new FormData(event.target);

    // Exibe a tela de loading
    loading.classList.add("active");

    try {
      // Envia os dados do formulário para o backend
      const response = await fetch("/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redireciona para a página "/client" após a criação do usuário
        window.location.href = "/client";
      } else {
        alert(result.error || "Erro ao criar usuário");
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário");
    } finally {
      // Oculta a tela de loading
      loading.classList.remove("active");
    }
  });
