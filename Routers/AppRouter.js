const AppRouter = require('express').Router();
const DashboardHandler = require('../RequestHandlers/AppHandlers/DashboardHandler');

AppRouter.get('/dashboard', (req, res, next) => DashboardHandler.getDashboard(req,res, next));
AppRouter.get('/dashboard/post', (req, res) => DashboardHandler.getPost(req,res));
AppRouter.put('/dashboard', (req, res) => DashboardHandler.addPost(req,res));

module.exports = AppRouter;