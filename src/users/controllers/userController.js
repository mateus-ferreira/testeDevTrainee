require('dotenv').config();
const PORT = process.env.PORT;
const db = require('../../database/model/user');
const { Op } = require('sequelize');
const validator = require('validator');

function validacao(dados){
    if(dados.nome !== null && dados.email !== null && dados.idade !==null){
        if((dados.nome.length > 2) && (validator.isEmail(dados.email)) && (dados.idade >=18 && dados.idade <=130)){
            return true
        }
    }else{
        return false
    }
}

class UserController{

    //post
    static async cadastrarUsuario(ctx){
        const dados = ctx.request.body
        try{
            const user = validacao(dados)
            if(user == true){
                await db.create(dados);
                ctx.body = user
                return ctx.status = 201
            }else{
                ctx.status = 400
                return ctx.body = 'Dados de cadastro incorretos'
            }
            
        }catch(error){
            return console.log(error)
        }
    }


    //get
    static async testServer(ctx){
        return ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`; //http://localhost:3000/ 
    }

    //get
    static async listaGeralUsuarios(ctx){
        try{
            const teste = await db.findAll({ attributes: ['nome', 'email', 'idade']});//{total:0, count: 0, rows:[]}
            ctx.body = teste;
            return ctx.status = 200;

        }catch(error){
            ctx.status = 500;
            return console.log(error);
        }
    }

    //get
    static async usuarioPorNome(ctx){
        const { nome } = ctx.request.params;
        try{
            const usuario = await db.findAll({ where: { nome: {[Op.substring]: nome }}});
            ctx.body = usuario;
            if(usuario == ''){
                return ctx.status = 404;
            }
            return ctx.status = 200;
        }catch(error){
            console.log(error)
            return ctx.status=404;
        }
    }
    
    //put
    static async editarUsuarioNome(ctx){
        const { nome } = ctx.request.params;
        const novoUsuario = ctx.request.body;

        try{
            const usuario = await db.findAll({ where: { nome: {[Op.like]: nome }}});
            if(usuario == ''){
                ctx.body = 'Usuario não encontrado'
                return ctx.status = 404;
            }
            const usuarioAtt = await db.update(novoUsuario, { where: { nome: {[Op.like]: nome }}});
            ctx.body = usuarioAtt;
            return ctx.status = 200
        }catch(error){
            return console.log(error);
        }
    }

    //delete
    static async excluirUsuarioNome(ctx){
        const { nome } = ctx.request.params;

        try{
            const usuario = await db.findAll({ where: { nome: {[Op.like]: nome }}});
            if(usuario == ''){
                ctx.body = 'Usuario não encontrado'
                return ctx.status = 404;
            }
            await db.destroy({ where: { nome: {[Op.like]: nome }}});
            return ctx.status = 204
        }catch(error){
            return console.log(error);
        }
    }
}

module.exports = UserController