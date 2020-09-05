const rootRouter = require('express').Router();

const pingRouter = require('./PingRouter');
const authRouter = require('./AuthRouter');
const Authorization = require('./Middlewares/AuthorizationMiddleware');
const appRouter = require('./AppRouter');

rootRouter.use('/ping',pingRouter);
rootRouter.use('/auth',authRouter);
rootRouter.use('/app',(req, res, next) => Authorization.authorize(req, res, next), appRouter);
//rootRouter.use('/app', appRouter);

module.exports = rootRouter;