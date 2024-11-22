import express from 'express';
import { PORT } from './helpers/constant.helper';
import cookieSession from 'cookie-session';
import cookieOptions from './config/cookie.config';
import cors from 'cors';
import corsOptions from './config/cors.config';
import { connectSequelize, syncModel } from './helpers/sequelize.helper';
const app = express();

app.use(cookieSession(cookieOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

connectSequelize()
  .then(() => syncModel())
  .then(() => {
    app.listen(PORT, () => {
      return console.log(`Express is listening at port ${PORT}`);
    });
  });
