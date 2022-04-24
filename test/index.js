//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app =  require('../src/index.js');

const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json-schema');
const db = require('../src/database/model/user');
const fs = require('fs');
const path = require('path')

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
    title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
    type: "object",
    required: ['nome', 'email', 'idade'],
    properties: {
        nome: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        idade: {
            type: 'number',
            minimum: 18
        }
    }
}

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe('Um simples conjunto de testes', function () {
    it('deveria retornar -1 quando o valor não esta presente', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});

//testes da aplicação
describe('Testes da aplicaçao',  () => {
    it('o servidor esta online', function (done) {
        chai.request(app)
        .get('/')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
        });
    });

    it('deveria ser uma lista vazia de usuarios', function (done) {
        chai.request(app)
        .get('/user')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.eql([]);
        done();
        });
    });

    it('deveria criar o usuario raupp', function (done) {
        chai.request(app)
        .post('/user')
        .send({nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35})
        .end(async function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            const createdUser = await db.findOne({ where: { nome: 'raupp'}});
            expect(createdUser).to.not.be.null;
            expect(createdUser.nome).to.be.eq('raupp');
            expect(createdUser.email).to.be.eq('jose.raupp@devoz.com.br');
            expect(createdUser.idade).to.be.eq(35);
            done();
        });
    });
    //...adicionar pelo menos mais 5 usuarios. se adicionar usuario menor de idade, deve dar erro. Ps: não criar o usuario naoExiste
    //possivelmente forma errada de verificar a mensagem de erro
    it('o usuario naoExiste não existe no sistema', function (done) {
        chai.request(app)
        .get('/user/naoExiste')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.body).to.be.empty; 
            expect(res).to.have.status(404);
            done();
        });
    });

    it('o usuario raupp existe e é valido', function (done) {
        chai.request(app)
        .get('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body[0]).to.be.jsonSchema(userSchema);
            done();
        });
    });

    it('deveria excluir o usuario raupp', function (done) {
        chai.request(app)
        .delete('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(204);
            done();
        });
    });

    it('o usuario raupp não deve existir mais no sistema', function (done) {
        chai.request(app)
        .get('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.body).to.be.empty;
            expect(res).to.have.status(404);
            done();
        });
    });

    describe('teste de usuários corretos', ()=> {
        it('criação do 1º usuário', function(done){
            chai.request(app)
            .post('/user')
            .send({nome: "Primeiro Usuario", email: "priUser@gmail.com", idade: 20})
            .end(async function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });

        it('criação do 2º usuário', function(done){
            chai.request(app)
            .post('/user')
            .send({nome: "Segundo Usuario", email: "segUser@gmail.com", idade: 20})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });

        it('criação do 3º usuário', function(done){
            chai.request(app)
            .post('/user')
            .send({nome: "Terceiro Usuario", email: "terUser@gmail.com", idade: 20})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });

        it('criação do 4º usuário', function(done){
            chai.request(app)
            .post('/user')
            .send({nome: "Quarto Usuario", email: "quaUser@gmail.com", idade: 20})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });

        it('criação do 5º usuário', function(done){
            chai.request(app)
            .post('/user')
            .send({nome: "Quinto Usuario", email: "quiUser@gmail.com", idade: 20})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });
        it('deveria ser uma lista com pelomenos 5 usuarios', function (done) {
            chai.request(app)
            .get('/user')
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.lengthOf(5);
            done();
            });
        });

        it('excluir um usuário existente', function(done){
            chai.request(app)
            .delete('/user/Quinto Usuario')
            .end(async function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
                const deletedUser = await db.findOne({ where: { nome: 'Quinto Usuario'}});
                expect(deletedUser).to.be.null;
                done();
            });
        });

        it('editar um usuário existente', function(done){
            chai.request(app)
            .post('/user')
            .send({nome: "Usuario Teste Put", email: "put@gmail.com", idade: 20})
            .end(async function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                chai.request(app)
                .put('/user/Usuario Teste Put')
                .send({nome: "usuario", email: "put@hotmail.com", idade: 21})
                .end(async function (err, res){
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const createdUser = await db.findOne({ where: { nome: 'usuario'}});
                    expect(createdUser).to.not.be.null;
                    expect(createdUser.nome).to.be.eq('usuario');
                    expect(createdUser.email).to.be.eq('put@hotmail.com');
                    expect(createdUser.idade).to.be.eq(21);
                    done();
                })
            })
        });
    });

    describe('teste usuários errados', ()=>{
        it('tentar cadastrar um menor de idade', function (done){
            chai.request(app)
            .post('/user')
            .send({nome: "Mateus", email: "user@gmail.com", idade: 17})
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        });

        it('tentar cadastrar um nome menor que o válido', function(done) {
            chai.request(app)
            .post('/user')
            .send({nome: "M", email: "user@gmail.com", idade: 22})
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        });

        it('tentar cadastrar um email inválido', function(done) {
            chai.request(app)
            .post('/user')
            .send({nome: "Mateus", email: "user", idade: 22})
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        });

        it('tentar cadastrar faltando um campo', function(done) {
            chai.request(app)
            .post('/user')
            .send({nome: "Mateus", email: "", idade: 22})
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        });

        it('não deveria excluir um usuário que não existe', function(done){
            chai.request(app)
            .delete('/user/Decimo Usuario')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                done();
            });
        });

        it('tentando editar um usuário não existente', function(done){
            chai.request(app)
            .put('/user/Usuario Nao Existente Teste Put')
            .send({nome: "Usuario Teste Put", email: "put@hotmail.com", idade: 20})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                done();
            })
        });
    });

    after('Removendo database', function () {
        fs.rmSync(path.join('database.sqlite'))
    })
});