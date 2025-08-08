import { auth } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btnLogin = document.getElementById("btnLogin");
const mensagemErro = document.getElementById("mensagemErro");

btnLogin.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, senha.value);
    window.location.href = "painel.html";
  } catch (error) {
    mensagemErro.style.display = "block";
    console.error("Erro ao logar:", error.message);
  }
});
