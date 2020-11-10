const express = require('express');
const rootRouter = require('./Routers/RootRouter');
const dbState = require('./Database/DbStateManager');
const port = 3000;

dbState.initState();

const app = express();
app.disable('x-powered-by');
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use('/', rootRouter);

app.listen(port, () => console.log(`Server started, listening at http://localhost:${port}`));