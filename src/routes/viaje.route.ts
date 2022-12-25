import {Router} from 'express';
import { createViajeHandler, deleteViajeHandler, updateViajeHandler, fetchViajesHandler } from '../controllers/viaje.controller';
import { requireUser } from '../middleware/require-user';
import { deserializeUser } from '../middleware/deserialize-user';

const router = Router();

router.use(deserializeUser, requireUser);

router.post("/create", createViajeHandler);

router.post("/update", updateViajeHandler);

router.post("/delete", deleteViajeHandler);

router.get("/all", fetchViajesHandler);

export default router ;