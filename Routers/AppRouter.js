const AppRouter = require('express').Router();
const DashboardHandler = require('../RequestHandlers/AppHandlers/DashboardHandler');
const ConfigHandler = require('../RequestHandlers/AppHandlers/ConfigurationHandler');

AppRouter.get('/config', (req,res,next) => ConfigHandler.getConfigurations(req,res,next));
AppRouter.get('/dashboard', (req, res, next) => DashboardHandler.getDashboard(req,res, next));
AppRouter.get('/dashboard/post', (req, res) => DashboardHandler.getPost(req,res));
AppRouter.put('/dashboard', (req, res) => DashboardHandler.addPost(req,res));

module.exports = AppRouter;