const form = document.getElementById("form");
const campos = document.querySelectorAll(".form-input");
const spans = document.querySelectorAll("span");
const icon = document.querySelectorAll(".icon");
const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (campos.length < 3) {
    passwordValidateLogin();
    emailValidateLogin();
    if (passwordValidateLogin() && emailValidateLogin()) {
      form.submit();
    }
  } else {
    console.log("entrei no else certo");
    emailValidate();
    passwordValidate();
    passwordComparation();
    nameValidate();
    if (
      emailValidate() &&
      passwordComparation() &&
      passwordValidate() &&
      nameValidate()
    ) {
      console.log("entrei no if certo");
      form.submit();
    }
  }
});

function emailValidateLogin() {
  if (campos[0].value.length < 1) {
    setError(0);
  } else if (!emailRegex.test(campos[0].value)) {
    setError(0);
    spans[0].innerHTML = "Insira  um email válido";
  } else {
    removeError(0);
    return true;
  }
}

function passwordValidateLogin() {
  if (campos[1].value.length < 1) {
    setError(1);
  } else {
    removeError(1);
    return true;
  }
}

function setError(index) {
  campos[index].setAttribute("style", "border:solid 2px var(--error-color);");
  spans[index].style.display = "block";
  icon[index].style.backgroundColor = "var(--error-color)";
}

function removeError(index) {
  campos[index].style.border = "";
  spans[index].style.display = "none";
}

function nameValidate() {
  if (campos[0].value.length < 3) {
    setError(0);
  } else {
    removeError(0);
    return true;
  }
}

function emailValidate() {
  if (!emailRegex.test(campos[1].value)) {
    setError(1);
  } else {
    removeError(1);
    return true;
  }
}

function passwordValidate() {
  if (campos[2].value.length < 8) {
    setError(2);
  } else {
    removeError(2);
    return true;
  }
}

function passwordComparation() {
  if (campos[2].value !== campos[3].value) {
    spans[3].innerHTML = "As senhas não são iguais";
    setError(3);
  } else if (campos[3].value.length < 8) {
    setError(3);
  } else {
    removeError(3);
    return true;
  }
}
