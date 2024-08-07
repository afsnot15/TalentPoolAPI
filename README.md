# TalentPoolAPI

API para Cadastro de Produto, destinado ao Code Talent Pool da VR Software.

## Iniciando Aplicação

Navegue até o diretório raiz do projeto.

Execute o seguinte comando:

```bash
 docker compose up
 ```
ou caso queria iniciar a aplicação em ambiente de testes:

 ```bash
 docker compose -f docker-compose-test.yml up
 ```

Para semear os dados necessárias para funcionamento da aplicação:

```bash
docker exec -it api-talentpool npm run seed
```

 - Atenção, caso a aplicação seja iniciada em ambiente de testes, os dados não serão persistidos.

## Excecução de testes

- Atenção: "attach" no container através do comando:

```bash
docker exec -it api-talentpool bash
```

Para rodar os testes unitários e gerar o relatório de cobertura, execute o seguinte comando:

## Unit

```bash
npm run test:cov
```

## E2E

Para semear as informações necessárias para os testes E2E:

```bash
npm run seed
```

Execução dos testes

```bash
npm run test:e2e:cov
```
