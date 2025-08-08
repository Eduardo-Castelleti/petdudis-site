import { db, storage } from "../firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const form = document.getElementById("form-produto");
const mensagemSucesso = document.getElementById("mensagemSucesso");
const mensagemErro = document.getElementById("mensagemErro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const imagem = document.getElementById("imagem").files[0];

  try {
    // 1. Upload da imagem
    const imagemRef = ref(storage, `produtos/${Date.now()}-${imagem.name}`);
    await uploadBytes(imagemRef, imagem);
    const urlImagem = await getDownloadURL(imagemRef);

    // 2. Cadastro no Firestore
    await addDoc(collection(db, "produtos"), {
      nome,
      descricao,
      preco,
      imagem: urlImagem,
      criadoEm: serverTimestamp()
    });

    // 3. Feedback e reset
    mensagemSucesso.style.display = "block";
    mensagemErro.style.display = "none";
    form.reset();
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error.message);
    mensagemSucesso.style.display = "none";
    mensagemErro.style.display = "block";
  }
});
