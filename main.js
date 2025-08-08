document.addEventListener('DOMContentLoaded', function () {

  // -------------------- PRODUTOS --------------------
  function paginaProdutos() {
    const urlParams = new URLSearchParams(window.location.search);
    const pet = urlParams.get("pet") || "cachorro";

    const dados = {
      cachorro: {
        titulo: "Todos os produtos para Cachorro",
        filtros: ["Ração Seca", "Ração Natural", "Ração Úmida", "Petiscos", "Tapetes"],
        produtos: [
          {
            nome: "Ração Nutrilius Pro+ Frango & Carne 20kg",
            precoDe: "R$ 215,90",
            precoPor: "R$ 194,31",
            peso: "20kg",
            imagem: "nutrilius20kg.png",
            brinde: true,
            maisVendido: true,
            recorrencia: true
          },
          {
            nome: "Ração Natural True Raças Pequenas 10,1kg",
            precoDe: "R$ 309,60",
            precoPor: "R$ 263,16",
            peso: "10,1kg",
            imagem: "true10kg.png",
            brinde: false,
            maisVendido: false,
            recorrencia: true
          }
        ]
      },
      gato: {
        titulo: "Todos os produtos para Gato",
        filtros: ["Ração Seca", "Areia Higiênica", "Snacks", "Brinquedos", "Arranhadores"],
        produtos: [
          {
            nome: "Ração Cat Premium Salmão 10kg",
            precoDe: "R$ 199,90",
            precoPor: "R$ 179,00",
            peso: "10kg",
            imagem: "racao-gato.png",
            brinde: false,
            maisVendido: true,
            recorrencia: true
          }
        ]
      }
    };

    const conteudo = dados[pet];
    if (!conteudo) return;

    document.getElementById("titulo-produtos").innerText = `${conteudo.titulo} (${conteudo.produtos.length} produtos)`;

    const ulFiltros = document.getElementById("filtros");
    ulFiltros.innerHTML = "";
    conteudo.filtros.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#">${item}</a>`;
      ulFiltros.appendChild(li);
    });

    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";
    conteudo.produtos.forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("card-produto");

      card.innerHTML = `
        <img src="${prod.imagem}" alt="${prod.nome}">
        <div class="selos">
          ${prod.maisVendido ? '<span class="mais-vendido">Mais Vendido</span>' : ""}
          ${prod.brinde ? '<span class="brinde">BRINDE</span>' : ""}
        </div>
        <h3>${prod.nome}</h3>
        <span class="peso">${prod.peso}</span>
        <p class="preco-antigo">${prod.precoDe}</p>
        <p class="preco-atual">${prod.precoPor}</p>
        ${prod.recorrencia ? '<p class="recorrencia"><i class="fas fa-sync-alt"></i> com recorrência</p>' : ""}
      `;
      lista.appendChild(card);
    });
  }

  // -------------------- CADASTRO --------------------
  function paginaCadastro() {
    const form = document.getElementById('formCadastro');
    if (!form) return;

    const msgErro = document.getElementById('msgErro');
    const msgSucesso = document.getElementById('msgSucesso');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      msgErro.style.display = 'none';
      msgSucesso.style.display = 'none';

      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const telefone = form.telefone.value.trim();
      const senha = form.senha.value.trim();
      const confSenha = form.confSenha.value.trim();

      if (nome.length < 3) return showError('Por favor, insira um nome válido.');
      if (!validateEmail(email)) return showError('Por favor, insira um e-mail válido.');
      if (!validateTelefone(telefone)) return showError('Telefone inválido. Use DDD e apenas números.');
      if (senha.length < 6) return showError('A senha deve ter pelo menos 6 caracteres.');
      if (senha !== confSenha) return showError('As senhas não conferem.');

      // Firebase Auth
      firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then(userCredential => {
          const user = userCredential.user;
          return user.updateProfile({
            displayName: nome,
            photoURL: "" // pode adicionar imagem padrão
          });
        })
        .then(() => {
          msgSucesso.textContent = 'Cadastro realizado com sucesso!';
          msgSucesso.style.display = 'block';

          setTimeout(() => {
            window.history.go(-2);
          }, 1500);
        })
        .catch(error => {
          showError(error.message);
        });
    });

    function showError(msg) {
      msgErro.textContent = msg;
      msgErro.style.display = 'block';
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function validateTelefone(telefone) {
      const regex = /^\d{10,11}$/;
      return regex.test(telefone);
    }
  }

  // -------------------- PERFIL --------------------
  const camposProtegidos = ["nome", "raça", "porte", "peso", "data de nascimento"];

  function editarCampo(id) {
    const campo = document.getElementById(id);
    if (!campo) return;

    const valorAtual = campo.innerText;

    if (camposProtegidos.includes(id.toLowerCase())) {
      alert("Este campo só pode ser alterado por um parceiro ou pela loja.");
      return;
    }

    const novoValor = prompt(`Editar ${id}:`, valorAtual);
    if (novoValor !== null && novoValor.trim() !== "") {
      campo.innerText = novoValor;
    }
  }

  function mostrarHistorico() {
    const historico = document.getElementById("historicoCompleto");
    if (historico) {
      historico.style.display = historico.style.display === "none" ? "block" : "none";
    }
  }

  const inputFoto = document.getElementById("uploadFoto");
  if (inputFoto) {
    inputFoto.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          document.getElementById("fotoPet").src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // -------------------- USUÁRIO LOGADO --------------------
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const btnLogin = document.getElementById("btn-login");
      if (btnLogin) {
        const nome = user.displayName || "Cliente";
        const foto = user.photoURL || "default-avatar.png";
        btnLogin.innerHTML = `
          <img src="${foto}" alt="Foto" style="width:32px;height:32px;border-radius:50%;margin-right:8px;">
          <span>${nome.split(" ")[0]}</span>
        `;
      }
    }
  });

  // -------------------- INIT --------------------
  const caminho = window.location.pathname;
  if (caminho.endsWith('produtos.html')) {
    paginaProdutos();
  } else if (caminho.endsWith('cadastro.html')) {
    paginaCadastro();
  }
});
