const Router = require('koa-router');
const { createUser, login, checkLogin } = require('../controllers');

const router = new Router();

    router
        .post('/user', createUser)
        .post('/login',login)
        .get('/custom', checkLogin);

module.exports = {
    routes () { return router.routes() },
    allowedMethods () { return router.allowedMethods() }
}