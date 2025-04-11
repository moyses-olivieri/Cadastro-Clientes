// Criar e selecionar o banco no localStorage
alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosql');
alasql('ATTACH LOCALSTORAGE DATABASE agrosql');
alasql('USE agrosql');

// Criando tabela de endereços (se não existir)
alasql(`CREATE TABLE IF NOT EXISTS enderecos (
  id INT AUTOINCREMENT,
  cep STRING,
  rua STRING,
  bairro STRING,
  cidade STRING,
  estado STRING,
  pais STRING,
  id_cliente INT
)`);

// Referências
const inputCEP = document.querySelector('#CEP');
const inputRua = document.querySelector('#Rua');
const inputBairro = document.querySelector('#Bairro');
const inputCidade = document.querySelector('#Cidade');
const inputEstado = document.querySelector('#Estado');
const inputPais = document.querySelector('#Pais');
const inputIdCliente = document.querySelector('#IdCliente');

const labelCEP = document.querySelector("label[for='CEP']");
const labelRua = document.querySelector("label[for='Rua']");
const labelBairro = document.querySelector("label[for='Bairro']");
const labelCidade = document.querySelector("label[for='Cidade']");
const labelEstado = document.querySelector("label[for='Estado']");
const labelPais = document.querySelector("label[for='Pais']");
const labelIdCliente = document.querySelector("label[for='IdCliente']");

// Textos originais
const textosOriginais = new Map([
  [labelCEP, labelCEP.innerText],
  [labelRua, labelRua.innerText],
  [labelBairro, labelBairro.innerText],
  [labelCidade, labelCidade.innerText],
  [labelEstado, labelEstado.innerText],
  [labelPais, labelPais.innerText],
  [labelIdCliente, labelIdCliente.innerText]
]);

// Eventos de input
inputCEP.addEventListener('input', () => validarCampo(inputCEP, labelCEP, 8, 'CEP inválido'));
inputRua.addEventListener('input', () => validarCampo(inputRua, labelRua, 3));
inputBairro.addEventListener('input', () => validarCampo(inputBairro, labelBairro, 3));
inputCidade.addEventListener('input', () => validarCampo(inputCidade, labelCidade, 3));
inputEstado.addEventListener('input', () => validarCampo(inputEstado, labelEstado, 2));
inputPais.addEventListener('input', () => validarCampo(inputPais, labelPais, 3));
inputIdCliente.addEventListener('input', () => validarCampo(inputIdCliente, labelIdCliente, 1));

// Validações
function validarCampo(input, label, minLength, msg = 'inválido') {
  const valor = input.value.trim();
  if (valor === '') {
    resetarEstilo(input, label);
  } else if (valor.length >= minLength) {
    definirValido(input, label);
  } else {
    definirInvalido(input, label, msg);
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

// Cadastro
function CadastrarEndereco() {
  validarCampo(inputCEP, labelCEP, 8, 'CEP inválido');
  validarCampo(inputRua, labelRua, 3);
  validarCampo(inputBairro, labelBairro, 3);
  validarCampo(inputCidade, labelCidade, 3);
  validarCampo(inputEstado, labelEstado, 2);
  validarCampo(inputPais, labelPais, 3);
  validarCampo(inputIdCliente, labelIdCliente, 1);

  const campos = [inputCEP, inputRua, inputBairro, inputCidade, inputEstado, inputPais, inputIdCliente];
  const todosValidos = campos.every(campo => campo.style.borderBottom === '2px solid green');

  const msgDiv = document.getElementById('mensagem');

  if (!todosValidos) {
    msgDiv.textContent = 'Preencha todos os campos corretamente!';
    msgDiv.className = 'mensagem erro';
    return;
  }

  // Inserir os dados na tabela 'enderecos'
  alasql('INSERT INTO enderecos (cep, rua, bairro, cidade, estado, pais, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    inputCEP.value,
    inputRua.value,
    inputBairro.value,
    inputCidade.value,
    inputEstado.value,
    inputPais.value,
    inputIdCliente.value
  ]);

  // Verificar se a inserção foi realizada com sucesso
  const dados = alasql('SELECT * FROM enderecos');
  console.log('Dados no banco após inserção:', dados);

  msgDiv.textContent = 'Endereço cadastrado com sucesso!';
  msgDiv.className = 'mensagem sucesso';

  // Limpar os campos
  document.querySelectorAll('input').forEach(input => input.value = '');

  // Redirecionar após 2 segundos
  setTimeout(() => {
    window.location.href = '../html/Login.html';
  }, 2000);
}
