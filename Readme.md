# 🌿 Sistema de Cadastro de Clientes

Sistema Web simples para cadastro de clientes e endereços, com validação de login e armazenamento local utilizando [AlaSQL.js](https://github.com/agershun/alasql).

## 📂 Estrutura do Projeto

![Estrutura](/assets/images/Estrutura.png)



## 🚀 Como rodar localmente

### 🔹 Opção 1: Abrir diretamente no navegador

1. Faça o download do projeto (ou clone o repositório).
2. Dê duplo clique no arquivo `index.html` para abrir no navegador.
3. A aplicação roda totalmente local, sem necessidade de servidor.

### 🔹 Opção 2: Usar Live Server (recomendado para desenvolvedores)

1. Instale a extensão **Live Server** no Visual Studio Code.
2. Abra a **pasta do projeto** no VS Code.
3. Clique com o botão direito no `index.html` e selecione **"Open with Live Server"**.
4. O sistema será iniciado em um servidor local (`http://127.0.0.1:5500/...`).

> ✅ Live Server é útil para evitar bloqueios de caminhos relativos em navegadores mais restritivos (como o Chrome em modo local).

## 📋 Funcionalidades

- Cadastro de Cliente com validação de CPF e Usuário.
- Cadastro de Endereço 
- Login e logout com verificação via LocalStorage
- Redirecionamento automático entre páginas
- Interface responsiva (mobile-friendly)

## 📦 Tecnologias

- HTML, CSS e JavaScript (Vanilla)
- AlaSQL.js (banco de dados local no navegador)

---

## 🔐 Login

Após cadastrar um cliente e endereço, use os mesmos dados no Login.

## ✍️ Autor

Desenvolvido por Moyses.
