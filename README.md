### Grupo Boticário Desafio – “Eu revendedor ‘O Boticário’ quero ter benefícios de acordo com o meu volume de vendas”

> **Requisitos back-end**
>
> Rota para cadastrar um novo revendedor(a)
> Rota para validar um login
> Rota para cadastrar uma nova compra
> Rota para listar as compras
> Rota para exibir o acumulado de cashback

<br>

> **Arquitetura desenvolvida**
>
> NestJs: Framework para acelerar desenvolvimento backend em Node.js. Facilidade para OO, modularização, injeção de dependências etc... 
>
> Microserviços: Padrão de arquitetura escalável, flexível e de alta disponibilidade.
>
> Egde-bff: Backends For Frontends serviço de borda para controlar as lógicas especificas de negócio de um produto complexo e eliminar qualquer chamada direta feita fora do perímetro dos serviços que ele atende.
>
> Docker: Conteinerização dos serviços utlizando imagens do Docker (Node.js e Postgres).
>
> Jest: Testes automatizados desenvolvidos com Jest.
>
>Swagger: Documentação de API's.
>
>JWT: Token de acesso assinado por chave secreta.
>
>Winston: Logs de aplicação personalizados.

<br>



![alt text](https://serving.photos.photobox.com/656897471f1ae81c20e1f80ad674eb63c6ab59f2eff198fef616035645bfbf8c11531afd.jpg)


### Iniciando o projeto

#### Entrar na pasta do serviço desejado

```bash
cd dealer-edge-bff or cd purchase-core or cd user-core
```

#### Criar uma rede externa com o Docker

```bash
docker network create services
```
#### Extrai uma imagem associada a um serviço

```bash
docker-compose build --pull node
```

#### Instalar dependências

```bash
docker-compose run --rm node npm i
```

#### Iniciar o projeto

```bash
docker-compose up
```

#### Inicie o banco de dados

```bash
docker-compose up database
```

#### Execute as migrações e sementes mais recentes

```bash
docker-compose run --rm node npm run ts-knex -- --knexfile=src/database/knexfile.ts migrate:latest # Run all migrations in typescript

docker-compose run --rm node npm run ts-knex -- --knexfile=src/database/knexfile.ts seed:run # Run all seeds in typescript
```

#### Para derrubar o banco de dados e todos os dados

```bash
docker-compose down -v
```

#### Para executar testes

```bash
docker-compose run --rm node npm run test # Run tests normally

docker-compose run --rm node npm run test:watch # Run tests in watch mode

docker-compose run --rm node npm run test:debug # Run tests in debug mode

docker-compose run --rm node npm run test:cov # Run tests with coverage report
```

#### Para executar eslint

```bash
docker-compose run --rm node npm run lint
```

#### Para validar os docs

```bash
docker-compose -f docker-compose.swagger.yml run --rm swagger-tools swagger-cli validate api.yaml
```

#### Para gerar o bundle do swagger

```bash
docker-compose -f docker-compose.swagger.yml run --rm swagger-tools swagger-cli bundle -t yaml -o bundle.yaml api.yaml
```
