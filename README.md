# Chatbot Node.js

Este repositório contém um chatbot desenvolvido em Node.js. O projeto é estruturado para facilitar a criação e manutenção de um chatbot interativo.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução para JavaScript no lado do servidor.
- **Express.js** - Framework para a criação de APIs e manipulação de rotas.
- **Outras dependências** (listadas no `package.json`).

## Estrutura do Projeto

```bash
chatbot-node/
│-- admin/             # Diretório para administração do chatbot (detalhar uso)
│-- src/               # Código-fonte principal do chatbot
│-- .gitignore         # Arquivos ignorados pelo Git
│-- README.md          # Documentação do projeto
│-- image.png          # Exemplo ou diagrama do chatbot
│-- index.js           # Arquivo principal de inicialização
│-- package.json       # Dependências e configurações do projeto
│-- package-lock.json  # Versões fixas das dependências

```

---

## Instalação e Execução

Clone o repositório:

```bash
git clone https://github.com/Le-Jr/chatbot-node.git
cd chatbot-node
```

## Instale as dependências:

```bash
npm install
```

## Como Contribuir

1. Fork este repositório.

2. Crie uma branch com sua funcionalidade:

```bash
git checkout -b minha-feature
```

3. Realize as modificações e commit:

```bash
git commit -m 'Adicionando nova funcionalidade'
```

4. Envie para o repositório remoto:

```bash
git push origin minha-feature
```

5. Abra um Pull Request.

# Explicação da Lógica do Código

A seguir, apresento uma visão geral da lógica do código com base nos seguintes arquivos:

- `index.js`
- `admin/server.js`
- `src/models/utils/openai_config.js`
- `src/models/Client.js`

---

## 1. `index.js` (Ponto de Entrada da Aplicação)

### a. Inicialização e Conexão com o Banco de Dados

- **Variáveis de Ambiente:**  
  Utiliza `dotenv/config` para carregar as variáveis de ambiente, incluindo `MONGO_URI`.
- **Conexão com o MongoDB:**  
  Conecta ao banco de dados utilizando o Mongoose. Se a conexão for bem-sucedida, exibe uma mensagem de sucesso; caso contrário, exibe um erro.

### b. Integração com o WhatsApp

- **Importação do WPPConnect:**  
  Utiliza a função `create` da biblioteca `@wppconnect-team/wppconnect` para criar sessões do WhatsApp.
- **Sessões para Cada Cliente:**
  - Busca os clientes registrados no banco de dados através do modelo `Client`.
  - Para cada cliente, inicia uma sessão do WhatsApp utilizando o `client.clientId` para identificá-la.
  - Configura opções do Puppeteer para rodar em modo headless e definir um diretório específico para os dados do usuário.
  - Define uma função `catchQR` que atualiza o QR Code do cliente no banco de dados quando necessário.

### c. Tratamento de Mensagens

- **Listener de Mensagens:**  
  Após a criação da sessão, registra um listener com `client.onMessage` para:
  - Ignorar mensagens de grupos ou mensagens sem conteúdo.
  - Encaminhar a mensagem para a função `generateAnswer` (que utiliza a API do OpenAI) para gerar uma resposta.
  - Enviar a resposta gerada de volta ao usuário com `client.sendText`.

---

## 2. `src/models/Client.js` (Modelo de Cliente)

### a. Definição do Esquema Mongoose

- **Campos Definidos:**
  - `clientId`: Identificador único para a sessão do cliente.
  - `phoneNumber`: Número de telefone do cliente.
  - `sessionPath`: Caminho utilizado para armazenar dados da sessão.
  - `config`: Objeto que pode conter configurações específicas (por exemplo, nome da empresa, FAQ, etc.).
  - `qrCode`: Armazena o QR Code gerado para a sessão, caso seja necessário para autenticação.

### b. Exportação do Modelo

- O modelo `Client` é exportado para ser utilizado em outras partes da aplicação, como na inicialização das sessões no `index.js`.

---

## 3. `src/models/utils/openai_config.js` (Configuração do OpenAI)

### a. Configuração da API do OpenAI

- **Importação e Configuração:**
  - Importa a biblioteca `OpenAI` e carrega a chave de API através do `dotenv/config`.
  - Cria uma instância do OpenAI, passando informações do projeto, organização e a chave da API.

### b. Função `generateAnswer`

- **Processo de Geração de Resposta:**
  - Recebe uma mensagem como entrada e prepara um prompt.
  - Realiza uma chamada à API do OpenAI utilizando o modelo `"gpt-4o"`, com parâmetros como:
    - `max_completion_tokens`: Limite de tokens para a resposta.
    - `temperature`: Controla a aleatoriedade da resposta.
    - Outros parâmetros conforme necessário.
  - Retorna a resposta gerada, que será enviada de volta ao usuário pelo chatbot.

---

## 4. `admin/server.js` e Interface Administrativa


### a. Configuração de um Servidor Express para Administração

- **Servidor Express:**  
  Configura um servidor Express que roda na porta 3000.
- **Configuração de Views e Arquivos Estáticos:**  
  Define o uso do EJS como engine para renderização das views e aponta para a pasta `public` para arquivos estáticos.

### b. Rotas Administrativas

- **Rota GET `/`:**  
  Busca todos os clientes do banco de dados e renderiza uma view (por exemplo, uma lista de clientes).
- **Rota GET `/client/:clientId`:**  
  Busca um cliente específico com base no `clientId` e renderiza uma view com os detalhes desse cliente.

Essa interface administrativa facilita:

- Visualizar o status dos clientes.
- Monitorar sessões e QR Codes.
- Gerenciar e atualizar as configurações dos clientes.

---

## Resumo da Lógica Geral

1. **Inicialização e Conexão:**  
   A aplicação se conecta ao MongoDB e carrega os clientes registrados.

2. **Criação de Sessões do WhatsApp:**  
   Para cada cliente, é criada uma sessão isolada usando o WPPConnect, permitindo a comunicação via WhatsApp.

3. **Processamento de Mensagens:**  
   Quando uma mensagem é recebida:

   - Se for uma mensagem individual (não de grupo) e tiver conteúdo, ela é encaminhada para a função `generateAnswer`.
   - A resposta gerada pelo OpenAI é enviada de volta ao usuário pelo WhatsApp.

4. **Interface Administrativa:**  
   Um servidor Express fornece uma interface para visualizar e gerenciar os clientes e suas sessões, facilitando o monitoramento e a administração do sistema.

---

Se precisar de mais detalhes ou tiver dúvidas sobre alguma parte específica do código, estou à disposição para ajudar!
