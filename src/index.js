//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const rotas = require('./users/rotas/rotas');
const koaBody = require('koa-body');

const sequelize = require('./database/model/user');
sequelize.sync();

const koa = new Koa();
var router = new Router();

koa
  .use(router.routes())
  .use(router.allowedMethods())
  .use(bodyParser())
  .use(koaBody());

rotas(router, koaBody)

const server = koa.listen(PORT);

module.exports = server;