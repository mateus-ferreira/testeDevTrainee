const usuario = require('../controllers/userController')

module.exports = (router, koaBody) => {
    //post
    router.post('/user', koaBody(),usuario.cadastrarUsuario);

    //get
    //rota simples pra testar se o servidor está online
    router.get('/', usuario.testServer);
        
    //Uma rota de exemplo simples aqui.
    //As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
    //get
    router.get('/user', usuario.listaGeralUsuarios);

    //get
    router.get('/user/:nome', usuario.usuarioPorNome);

    //put
    router.put('/user/:nome', koaBody(),usuario.editarUsuarioNome);

    //delete
    router.delete('/user/:nome', usuario.excluirUsuarioNome);
}