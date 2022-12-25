import {Router} from 'express';
import { createConceptoHandler, updateConceptoHandler, deleteConceptoHandler, fetchConceptosFromViajeHandler } from '../controllers/concepto.controller';

const router = Router();

// router.use(deserializeUser, requireUser);

router.post("/create", createConceptoHandler);

router.post("/update", updateConceptoHandler);

router.post("/delete", deleteConceptoHandler);

router.get("/all/:viajeId", fetchConceptosFromViajeHandler);

export default router ;