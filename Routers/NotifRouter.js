const NotifRouter = require('express').Router();
const NotifHandler = require('../RequestHandlers/AppHandlers/NotifHandler');

NotifRouter.post('/send', (req,res,next) => NotifHandler.sendNotification(req,res,next));

module.exports = NotifRouter;