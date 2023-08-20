import express from 'express';
import { loginHandler, registerHandler, resetPasswordHandler, resetPasswordRequestHandler } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema, resetPasswordRequestSchema, resetPasswordSchema } from '../schemas/user.schema';

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

// Reset password request route
router.post('/forgot-password', validate(resetPasswordRequestSchema), resetPasswordRequestHandler);

// Reset password route
router.patch('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);

export default router;
