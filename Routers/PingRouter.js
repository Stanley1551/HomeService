const Router = require('express').Router();
const PingHandler = require('../RequestHandlers/PingHandler');

Router.get('',(req, res) => PingHandler.handle(req, res));

module.exports = Router;