// Conecta ao banco salvo no navegador
alasql('ATTACH LOCALSTORAGE DATABASE agrosql;');
alasql('USE agrosql;');

// Mostrar/ocultar senha
let btn = document.querySelector('.fa-eye');
btn.addEventListener('click', () => {
  let inputSenha = document.querySelector('#senha');
  inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';
});

// Cria tabelas somente se ainda não existirem
alasql('CREATE TABLE IF NOT EXISTS clientes (id INT, nome STRING, usuario STRING, senha STRING, cpf STRING, nascimento STRING, telefone STRING, celular STRING)');
alasql('CREATE TABLE IF NOT EXISTS enderecos (id INT, cep STRING, rua STRING, bairro STRING, cidade STRING, estado STRING, pais STRING, id_cliente INT)');

// Preenche com dados fictícios caso esteja vazio
if (alasql('SELECT COUNT(*) AS total FROM clientes')[0].total === 0) {
  alasql('INSERT INTO clientes VALUES (1, "João Silva", "joaos", "1234", "12345678900", "1990-01-01", "1122334455", "11999999999")');
}
if (alasql('SELECT COUNT(*) AS total FROM enderecos')[0].total === 0) {
  alasql('INSERT INTO enderecos VALUES (1, "12345678", "Rua das Flores", "Centro", "São Paulo", "SP", "Brasil", 1)');
}

// Exporta banco pré-populado (estrutura vazia)
function exportarBanco() {
  const bancoVazio = {
    clientes: [],
    enderecos: []
  };

  const blob = new Blob([JSON.stringify(bancoVazio, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'banco_pre_populado.json';
  link.click();

  URL.revokeObjectURL(url);
}

// Exporta banco real com todos os cadastros atuais
function exportarBancoReal() {
  const clientes = alasql('SELECT * FROM clientes');
  const enderecos = alasql('SELECT * FROM enderecos');
  const bancoCompleto = { clientes, enderecos };

  const blob = new Blob([JSON.stringify(bancoCompleto, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'banco_real_completo.json';
  link.click();

  URL.revokeObjectURL(url);
}

// Função de login
function login() {
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const mensagemErro = document.getElementById('erroLogin');

  const resultado = alasql('SELECT * FROM clientes WHERE usuario = ? AND senha = ?', [usuario, senha]);

  if (resultado.length > 0) {
    const token = gerarToken();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(resultado[0]));

    console.log('Usuário autenticado:', resultado[0]);
    console.log('Token gerado:', token);

    window.location.href = '../../index.html';
  } else {
    mensagemErro.style.display = 'block';
    mensagemErro.textContent = 'Usuário ou senha incorretos.';
  }
}

// Geração de token simples
function gerarToken() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return token;
}

// Esconde mensagem de erro ao digitar novamente
document.getElementById('usuario').addEventListener('input', () => {
  document.getElementById('erroLogin').style.display = 'none';
});
document.getElementById('senha').addEventListener('input', () => {
  document.getElementById('erroLogin').style.display = 'none';
});
