const rootRouter = require('express').Router();

const pingRouter = require('./PingRouter');
const authRouter = require('./AuthRouter');

rootRouter.use('/ping',pingRouter);
rootRouter.use('/auth',authRouter);

module.exports = rootRouter;