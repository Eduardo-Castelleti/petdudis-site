// Configuração Firebase — substitua com a sua config real
const firebaseConfig = {
  apiKey: "AIzaSyDVr6OOQRt2rB0kByInjqjdyoQCpnMAt7I",
  authDomain: "site-f6495.firebaseapp.com",
  projectId: "site-f6495",
  storageBucket: "site-f6495.firebasestorage.app",
  messagingSenderId: "230161402024",
  appId: "1:230161402024:web:462a911919ebf8a0809a9d"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {

  // -------------------- MODAL LOGIN --------------------

  const btnLogin = document.getElementById('abrir-login');
  const modalLogin = document.getElementById('modal-login');
  const formLogin = document.getElementById('form-login');
  const msgErroLogin = document.getElementById('mensagem-erro');

  if (btnLogin && modalLogin) {
    btnLogin.addEventListener('click', e => {
      e.preventDefault();
      msgErroLogin.textContent = '';
      modalLogin.style.display = 'flex';
    });
  }

  window.fecharModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
  };

  // Fechar modal clicando fora do conteúdo
  window.addEventListener('click', (e) => {
    if (e.target === modalLogin) {
      modalLogin.style.display = 'none';
    }
  });

  // -------------------- LOGIN --------------------

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      msgErroLogin.textContent = '';

      const email = formLogin.email.value.trim();
      const senha = formLogin.senha.value.trim();

      if (!validateEmail(email)) {
        msgErroLogin.textContent = 'E-mail inválido.';
        return;
      }

      if (senha.length < 6) {
        msgErroLogin.textContent = 'Senha deve ter no mínimo 6 caracteres.';
        return;
      }

      // Tenta login primeiro
      firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(() => {
          modalLogin.style.display = 'none';
          formLogin.reset();
        })
        .catch(error => {
          // Se erro for usuário não encontrado, tenta criar cadastro simples (sem nome)
          if (error.code === 'auth/user-not-found') {
            firebase.auth().createUserWithEmailAndPassword(email, senha)
              .then(() => {
                modalLogin.style.display = 'none';
                formLogin.reset();
              })
              .catch(errCadastro => {
                msgErroLogin.textContent = errCadastro.message;
              });
          } else {
            msgErroLogin.textContent = error.message;
          }
        });
    });
  }

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

    const titulo = document.getElementById("titulo-produtos");
    if (titulo) {
      titulo.innerText = `${conteudo.titulo} (${conteudo.produtos.length} produtos)`;
    }

    const ulFiltros = document.getElementById("filtros");
    if (ulFiltros) {
      ulFiltros.innerHTML = "";
      conteudo.filtros.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#">${item}</a>`;
        ulFiltros.appendChild(li);
      });
    }

    const lista = document.getElementById("lista-produtos");
    if (lista) {
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
  }

  // -------------------- CADASTRO (pagina cadastro.html) --------------------

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

      function showError(msg) {
        msgErro.textContent = msg;
        msgErro.style.display = 'block';
      }
    });
  }

  // -------------------- VALIDAÇÕES --------------------

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateTelefone(telefone) {
    const regex = /^\d{10,11}$/;
    return regex.test(telefone);
  }

  // -------------------- USUÁRIO LOGADO --------------------

  firebase.auth().onAuthStateChanged(user => {
    const btnLoginContainer = document.getElementById("btn-login");
    if (!btnLoginContainer) return;

    if (user) {
      const nome = user.displayName || "Cliente";
      const foto = user.photoURL || "default-avatar.png";
      btnLoginContainer.innerHTML = `
        <img src="${foto}" alt="Foto" style="width:32px;height:32px;border-radius:50%;margin-right:8px;vertical-align:middle;">
        <span>${nome.split(" ")[0]}</span>
        <button id="btn-logout" title="Sair" style="margin-left:12px; cursor:pointer; background:none; border:none; color:#fff; font-size:14px;">&#x2716;</button>
      `;

      // Logout
      const btnLogout = document.getElementById("btn-logout");
      if (btnLogout) {
        btnLogout.addEventListener("click", () => {
          firebase.auth().signOut();
        });
      }
    } else {
      btnLoginContainer.innerHTML = `<a href="#" id="abrir-login"><i class="fas fa-user"></i> Entrar | Cadastrar</a>`;
      // Re-bind o evento abrir modal login
      const btnAbrirLogin = document.getElementById('abrir-login');
      if (btnAbrirLogin) {
        btnAbrirLogin.addEventListener('click', e => {
          e.preventDefault();
          msgErroLogin.textContent = '';
          modalLogin.style.display = 'flex';
        });
      }
    }
  });

  // -------------------- INICIALIZAÇÃO --------------------

  const caminho = window.location.pathname;

  if (caminho.endsWith('produtos.html')) {
    paginaProdutos();
  } else if (caminho.endsWith('cadastro.html')) {
    paginaCadastro();
  }

});

