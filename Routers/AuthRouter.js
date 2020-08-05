const AuthRouter = require('express').Router();
const AuthHandler = require('../RequestHandlers/AuthHandler');

AuthRouter.get('/users', (req, res) => AuthHandler.getUsers(req, res));
AuthRouter.post('/register', (req, res) => AuthHandler.addUser(req,res));
AuthRouter.post('/login', (req, res) => {AuthHandler.checkUser(req,res)});

module.exports = AuthRouter;