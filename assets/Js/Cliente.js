// Criar e selecionar o banco no localStorage
alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosql');
alasql('ATTACH LOCALSTORAGE DATABASE agrosql');
alasql('USE agrosql');

// ALA SQL - Criação e uso do banco
alasql(`CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTOINCREMENT,
  nome STRING,
  usuario STRING,
  cpf INT,
  nascimento DATE,
  telefone STRING,
  celular STRING,
  senha STRING
)`);

// VARIÁVEIS
let btnSenha = document.querySelectorAll('.fa-eye')[0];
let btnConfirm = document.querySelectorAll('.fa-eye')[1];

let inputNome = document.querySelector('#Nome');
let inputUsuario = document.querySelector('#Usuário');
let inputCPF = document.querySelector('#CPF');
let inputDataNascimento = document.querySelector('#DataNascimento');
let inputTelefone = document.querySelector('#Telefone');
let inputCelular = document.querySelector('#Celular');
let inputSenha = document.querySelector('#Senha');
let inputConfirmSenha = document.querySelector('#ConfirmSenha');

let labelNome = document.querySelector("label[for='Nome']");
let labelUsuario = document.querySelector("label[for='Usuário']");
let labelCPF = document.querySelector("label[for='CPF']");
let labelDataNascimento = document.querySelector("label[for='DataNascimento']");
let labelTelefone = document.querySelector("label[for='Telefone']");
let labelCelular = document.querySelector("label[for='Celular']");
let labelSenha = document.querySelector("label[for='Senha']");
let labelConfirmSenha = document.querySelector("label[for='ConfirmSenha']");

// Salva os textos originais das labels
const textosOriginais = new Map([
  [labelNome, labelNome.innerText],
  [labelUsuario, labelUsuario.innerText],
  [labelCPF, labelCPF.innerText],
  [labelDataNascimento, labelDataNascimento.innerText],
  [labelTelefone, labelTelefone.innerText],
  [labelCelular, labelCelular.innerText],
  [labelSenha, labelSenha.innerText],
  [labelConfirmSenha, labelConfirmSenha.innerText]
]);

// EVENTOS
btnSenha.addEventListener('click', () => {
  inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';
});
btnConfirm.addEventListener('click', () => {
  inputConfirmSenha.type = inputConfirmSenha.type === 'password' ? 'text' : 'password';
});

inputNome.addEventListener('input', () => validarCampo(inputNome, labelNome, 3, 'mín. 3 caracteres'));
inputUsuario.addEventListener('input', () => validarCampo(inputUsuario, labelUsuario, 5, 'mín. 5 caracteres'));
inputCPF.addEventListener('input', () => validarCPF());
inputTelefone.addEventListener('input', () => validarCampo(inputTelefone, labelTelefone, 8, 'inválido'));
inputCelular.addEventListener('input', () => validarCampo(inputCelular, labelCelular, 9, 'inválido'));
inputSenha.addEventListener('input', () => validarSenha());
inputConfirmSenha.addEventListener('input', () => validarConfirmacaoSenha());

// FUNÇÕES DE VALIDAÇÃO
function validarCampo(input, label, minLength, msg = '') {
  const valor = input.value.trim();
  if (valor === '') {
    resetarEstilo(input, label);
  } else if (valor.length >= minLength) {
    definirValido(input, label);
  } else {
    definirInvalido(input, label, msg);
  }
}

function validarCPF() {
  let valor = inputCPF.value.replace(/\D/g, '');
  inputCPF.value = valor;

  if (valor === '') {
    resetarEstilo(inputCPF, labelCPF);
  } else if (valor.length === 11) {
    definirValido(inputCPF, labelCPF);
  } else {
    definirInvalido(inputCPF, labelCPF, 'CPF inválido');
  }
}

function validarSenha() {
  const valor = inputSenha.value.trim();
  if (valor === '') {
    resetarEstilo(inputSenha, labelSenha);
  } else if (valor.length >= 6) {
    definirValido(inputSenha, labelSenha);
  } else {
    definirInvalido(inputSenha, labelSenha, 'mín. 6 caracteres');
  }

  validarConfirmacaoSenha();
}

function validarConfirmacaoSenha() {
  const senha = inputSenha.value;
  const confirm = inputConfirmSenha.value;

  if (confirm === '') {
    resetarEstilo(inputConfirmSenha, labelConfirmSenha);
  } else if (senha === confirm && senha.length >= 6) {
    definirValido(inputConfirmSenha, labelConfirmSenha);
  } else {
    definirInvalido(inputConfirmSenha, labelConfirmSenha, 'As senhas não conferem');
  }
}

function definirValido(input, label) {
  input.style.borderBottom = '2px solid green';
  label.style.color = 'green';
  label.innerHTML = textosOriginais.get(label);
}

function definirInvalido(input, label, mensagem) {
  input.style.borderBottom = '2px solid red';
  label.style.color = 'red';
  label.innerHTML = `${textosOriginais.get(label)} <small style="font-size: 10px; color: red;">(${mensagem})</small>`;
}

function resetarEstilo(input, label) {
  input.style.borderBottom = '';
  label.style.color = '';
  label.innerHTML = textosOriginais.get(label);
}

// CADASTRO
function Cadastrar() {
  validarCampo(inputNome, labelNome, 3, 'mín. 3 caracteres');
  validarCampo(inputUsuario, labelUsuario, 5, 'mín. 5 caracteres');
  validarCPF();
  validarCampo(inputTelefone, labelTelefone, 8, 'inválido');
  validarCampo(inputCelular, labelCelular, 9, 'inválido');
  validarSenha();
  validarConfirmacaoSenha();

  const campos = [inputNome, inputUsuario, inputCPF, inputTelefone, inputCelular, inputSenha, inputConfirmSenha];
  const todosValidos = campos.every(campo => campo.style.borderBottom === '2px solid green');

  const msgDiv = document.getElementById('mensagem');

  if (!todosValidos) {
    msgDiv.textContent = 'Preencha todos os campos corretamente antes de cadastrar!';
    msgDiv.className = 'mensagem erro';
    return;
  }

  // Verifica se já existe usuário ou CPF no banco
  let usuarioExistente = alasql('SELECT * FROM clientes WHERE usuario = ?', [inputUsuario.value]);
  let cpfExistente = alasql('SELECT * FROM clientes WHERE cpf = ?', [inputCPF.value]);

  if (usuarioExistente.length > 0) {
    msgDiv.textContent = 'Nome de usuário já está em uso!';
    msgDiv.className = 'mensagem erro';
    return;
  }

  if (cpfExistente.length > 0) {
    msgDiv.textContent = 'CPF já cadastrado!';
    msgDiv.className = 'mensagem erro';
    return;
  }

  // Salva no banco com AlaSQL
  alasql('INSERT INTO clientes (nome, usuario, cpf, nascimento, telefone, celular, senha) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    inputNome.value,
    inputUsuario.value,
    inputCPF.value,
    inputDataNascimento.value,
    inputTelefone.value,
    inputCelular.value,
    inputSenha.value
  ]);

  msgDiv.textContent = 'Cadastro realizado com sucesso!';
  msgDiv.className = 'mensagem sucesso';

  // Limpa os campos
  document.querySelectorAll('input').forEach(input => input.value = '');

  // Redireciona após 3 segundos
  setTimeout(() => {
    window.location.href = '../html/Endereco.html';
    ;
  }, 3000);
}
