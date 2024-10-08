import express from 'express';
import {
  getAllUsersHandler,
  getMeHandler,
} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserialize-user';
import { requireUser } from '../middleware/require-user';

const router = express.Router();
router.use(deserializeUser, requireUser);

// Admin Get Users route
router.get('/', getAllUsersHandler);

// Get my info route
router.get('/me', getMeHandler);

export default router;

