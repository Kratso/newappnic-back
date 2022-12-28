require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './utils/db-connection';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import viajeRouter from './routes/viaje.route';
import conceptoRouter from './routes/concepto.route';

const app = express();

// Middleware

// Body Parser
app.use(express.json({ limit: '40kb' }));

// Cookie Parser
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// CORS
app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true,
  })
);

// Routing
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/viaje', viajeRouter);
app.use('/api/conceptos', conceptoRouter)

// Testing
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to this API 😎😎😎😎',
  });
});

// Unknown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.get<number>('port');
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  dbConnection()
});
