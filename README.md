# 🧠 Wits - API
<br>

<img src="https://i.imgur.com/18VE9Qi.png"></img>

<br>

Bem-vindo ao projeto back-end do Wits, seu e-learning gamificado de aprendizado de raciocínio e lógica. Aqui, iremos lhe instruir em como lançar a aplicação localmente e utilizá-la.

<br>

## 📖 Índice
- [Instalação](#installation)
- [Configuração](#configuration)
- [Swagger](#swagger)
- [Testes Unitários](#tests)
- [Tecnologias Utilizadas](#techs-used)
- [Equipe](#team)

## Instalação <a name="installation"></a>
Para instalar o projeto, será necessário algum gerenciador de pacotes JavaScript (NPM, Yarn, PNPM, Bun...).

Primeiro, abra sua linhade comando e digite a seguinte linha:
```
git clone https://github.com/odavibatista/wits-site-api.git
```

E em seguida:
```
cd wits-site-api
```

Já na root do projeto, baixe as dependências com o seu comando de instalação (com base noseu gerenciador de pacotes):

```
npm install

yarn install

bun install
```

## Configuração <a name="configuration"></a>

Após instalar as dependências, é preciso configurar as variáveis de ambiente do mesmo. Para isso, faça uma cópia do arquivo `.env.example` presente na root do projeto e nomeie-o para `.env`.

Dentro dele, você encontrará o seguinte esqueleto de variáveis presente:
```
# Database Variables
DB_ENGINE= (tipo de banco que utilizaremos)
DB_HOST= (hostname do banco de dados)
DB_PORT= (porta do banco de dados)
DB_USER= (usuário de acesso do banco de dados)
DB_PASSWORD= (senha de acesso do usuário)
DB_DATABASE= (nome do banco)
DB_ENTITIES= (formulação para encontrar os arquivos de entidades da API)

# JWT Variables
JWT_KEY= (uma chave para criarmos tokens JWT)

# API Variables
API_PORT= (porta em que você irá rodar, recomendamos a 5000)
API_URL= (a url da sua API, recomendamos inserir 'http://localhost:5000'.)

# Integration Variables
FRONTEND_URL= (a url do seu front-end, geralmente 'http://localhost:3000'.)

# Application Environment
NODE_ENV= (o ambiente em que seu projeto será executado em runtime, recomendamos 'local' ou 'development' para este projeto)
```

Ao preenchermos a `.env` corretamente, teremos algo similar a isso:
```
# Database Variables
DB_ENGINE=mysql (P.S: PODEMOS USAR POSTGRES)
DB_HOST=localhost
DB_PORT=3306 (OU 5432, PARA POSTGRES)
DB_USER=SEU_USUARIO_AQUI
DB_PASSWORD=SUA_SENHA_AQUI
DB_DATABASE=wits
DB_ENTITIES=dist/**/*.entity{.ts,.js} (PREENCHER DESTE MODO)

# JWT Variables
JWT_KEY=MINHA_CHAVE-JWT

# API Variables
API_PORT=5000
API_URL=http://localhost:5000

# Integration Variables
FRONTEND_URL=http://localhost:3000

# Application Environment
NODE_ENV=development
```

Após isso, podemos executar os scripts de criação e seeding do banco de dados. Na linha de comando, rodamos:
```
npm run db:create
```

E depois:
```
npm run db:seed
```

A API irá concatenar o nome do banco de dados com o ambiente, caso este seja diferente de `production`, e assim, teremos um banco com o nome `wits_development` na instância de banco de dados que você tiver inserido acima.

Com isso, o seed será efetuado e as entidades pré-definidas estarão presentes no banco para que você possa testar a aplicação e consumi-la.

Com isso, podemos finalmente lançar a nossa aplicação. Com isso, basta que digitemos na linha de comando:
```
npm run start:dev
```

A aplicação irá conectar ao banco de dados caso tudo tenha sido corretamente instalado e configurado, e assim poderemos utilizá-la e testá-la.

## Swagger <a name="swagger"></a>
Após isso, poderemos acessar a documentação dos endpoints através do endpoint costumizado do Swagger. Acessemos a seguinte URL:
`localhost:{PORTA_DA_API}/swagger`

Chegaremos então à seguinte tela, contendo todos os endpoitns da nossa API, prontos para serem vistos:

<img src="https://i.imgur.com/BHhBING.png"></img>

Com isso, podemos começar a consumi-la e utilizá-la para manipular os dados nela existentes e que virão a existir.

## Testes Unitários <a name="tests"></a>

Para rodar os testes unitários da aplicação, é preciso alterar o valor da variável `NODE_ENV` para `test`. Após isso, precisamos criar o banco de testes e seedá-lo para efetuar os testes. Para isso, rodamos:

```
npm run db:create
```

E depois:
```
npm run db:seed
```

Por fim, podemos rodar o script de testes do Jest:
```
npm run test:watch
```

Com isso, podemos escolher quais suites de testes desejamos rodar.

## Tecnologias Utilizadas <a name="techs-used"></a>
- [BCrypt](https://www.npmjs.com/package/bcrypt)
- [CORS](https://www.npmjs.com/package/cors)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/gettingstarted/)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [Jest](https://jestjs.io/pt-BR/)
- [JWT](https://jwt.io/)
- [MySQL](https://www.mysql.com/)
- [NestJS](https://nestjs.com/)
- [NodeJS](https://nodejs.org/)
- [Prettier](https://www.npmjs.com/package/prettier)
- [PostgreSQL](https://www.postgresql.org/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [TS-Node-Dev](https://www.npmjs.com/package/ts-node-dev)
- [TypeORM](https://typeorm.io/)
- [TypeORM Extension](https://www.npmjs.com/package/typeorm-extension)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)

## Equipe <a name="team"></a>

- [Bruno Almeida](https://github.com/thenrybruno)
- [Davi Batista](https://github.com/odavibatista)
- [Thiago Magno](https://github.com/thgmagno)