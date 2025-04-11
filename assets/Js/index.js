// Verifica se o token existe ao carregar a página
if (localStorage.getItem('auth_token') === null) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = './assets/html/Login.html';


  } else {
    // Recupera e exibe o nome do usuário
    const usuario = JSON.parse(localStorage.getItem('auth_user'));
    document.getElementById('nomeUsuario').textContent = usuario.nome;
  }
  
  // Função de sair
  function sair() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = './assets/html/Login.html';
  }
  