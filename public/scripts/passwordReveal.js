document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordVisibility = (inputField, eyeIcon, eyeClosedIcon) => {
    if (inputField.type === "password") {
      inputField.type = "text";
      eyeIcon.style.display = "none";
      eyeClosedIcon.style.display = "block";
    } else {
      inputField.type = "password";
      eyeIcon.style.display = "block";
      eyeClosedIcon.style.display = "none";
    }
    console.log("Sentiu aí? 😶‍🌫️");
  };

  const passwordConfirmbutton = document.querySelector("#reveal");
  const passwordButton = document.querySelector("#revealButton");
  let password = document.querySelector("#password");
  let passwordConfirm = document.querySelector("#passwordConfirm");

  let eye = document.querySelector("#eye");
  let eyeConfirm = document.querySelector("#eyeConfirm");
  let eyeClosed = document.querySelector("#eyeClosed");
  let eyeClosedConfirm = document.querySelector("#eyeClosedConfirm");

  passwordConfirmbutton.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePasswordVisibility(passwordConfirm, eyeConfirm, eyeClosedConfirm);
  });

  passwordButton.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePasswordVisibility(password, eye, eyeClosed);
  });
});
