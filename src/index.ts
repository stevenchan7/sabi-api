import express, { NextFunction, Request, Response } from 'express';
import { PORT } from './helpers/constant.helper';
import cookieSession from 'cookie-session';
import cookieOptions from './config/cookie.config';
import cors from 'cors';
import corsOptions from './config/cors.config';
import { connectSequelize, syncModel } from './helpers/sequelize.helper';
import CustomError from './helpers/error.helper';
const app = express();

app.use(cookieSession(cookieOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Error handler
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({
    status: 'fail',
    message: err.message,
    data: err.data,
  });
});

connectSequelize()
  .then(() => syncModel())
  .then(() => {
    app.listen(PORT, () => {
      return console.log(`Express is listening at port ${PORT}`);
    });
  });
