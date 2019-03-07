const Router = require('koa-router');
const { createUser, login, checkLogin, logout } = require('../controllers');

const router = new Router();

    router
        .post('/register', createUser)
        .post('/login',login)
        .get('/checkLogin', checkLogin)
        .get('/logout', logout);

module.exports = {
    routes () { return router.routes() },
    allowedMethods () { return router.allowedMethods() }
}