import express from 'express';
import bodyParser from 'body-parser';
import tokenManager from './my_modules/tokenManager';

const app = express();

// === Middleware

// parse application/json
app.use(bodyParser.json());

// token authentication
app.use('/user', (req, res, next) =>{
  tokenManager.verifyToken(req, res, next);
});

// === Routes 
/* const indexRouter = require('./routes/index');
const userRouter = require('./routes/user'); */
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/user');

/* app.use('/', indexRouter);
app.use('/', userRouter); */
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});