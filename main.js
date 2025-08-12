document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-login');
  const btnAbrir = document.getElementById('btnAbrirLogin');
  const btnFechar = modal.querySelector('.fechar');
  const btnCadastrar = document.getElementById('btnCadastrar');
  const formLogin = document.getElementById('formLogin');
  const msgErro = document.getElementById('mensagem-erro');

  // Abre o modal
  btnAbrir.addEventListener('click', () => {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    // Foca no campo email
    document.getElementById('emailLogin').focus();
  });

  // Fecha o modal
  btnFechar.addEventListener('click', () => {
    fecharModal();
  });

  // Fecha o modal clicando fora do conteúdo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  });

  // Função para fechar modal
  function fecharModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    msgErro.style.display = 'none';
    msgErro.textContent = '';
    formLogin.reset();
  }

  // Botão cadastrar redireciona para página de cadastro
  btnCadastrar.addEventListener('click', () => {
    window.location.href = 'cadastro.html'; // ajuste conforme sua estrutura
  });

  // Validação e login com Firebase Authentication
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    msgErro.style.display = 'none';
    msgErro.textContent = '';

    const email = formLogin.email.value.trim();
    const senha = formLogin.senha.value.trim();

    if (!validateEmail(email)) {
      mostrarErro('Por favor, insira um e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      mostrarErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Aqui inicia autenticação com Firebase
    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        // Login realizado com sucesso
        fecharModal();
        // Opcional: atualizar UI com nome do usuário
        alert('Login realizado com sucesso! Bem-vindo, ' + (userCredential.user.displayName || email.split('@')[0]));
        // Redirecionar ou atualizar página, se quiser:
        // window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        mostrarErro(error.message);
      });
  });

  function mostrarErro(mensagem) {
    msgErro.textContent = mensagem;
    msgErro.style.display = 'block';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
});
