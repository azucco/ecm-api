import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import tokenManager from './my_modules/tokenManager';


const app = express();

// === Middleware

// parse application/json
app.use(bodyParser.json());

// token authentication
/* app.use('/user', (req, res, next) =>{
  tokenManager.verifyToken(req, res, next);
}); */
app.use('/coffee', (req, res, next) =>{
  tokenManager.verifyToken(req, res, next);
});

// CORS
/* var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} */

app.use(cors())


// === Routes 
/* const indexRouter = require('./routes/index');
const userRouter = require('./routes/user'); */
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/users');
const coffeeRouter = require('./routes/coffee');

/* app.use('/', indexRouter);
app.use('/', userRouter); */
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', userRouter);
app.use('/', coffeeRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});