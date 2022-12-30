import { Router } from "express";
import {
  createConceptoHandler,
  updateConceptoHandler,
  deleteConceptoHandler,
  fetchConceptosFromViajeHandler,
  fetchConceptosGroupedByViajeHandler,
  fetchConceptosGroupedByCategoriaHandler,
} from "../controllers/concepto.controller";
import { deserializeUser } from "../middleware/deserialize-user";
import { requireUser } from "../middleware/require-user";

const router = Router();

router.use(deserializeUser, requireUser);

router.post("/create", createConceptoHandler);

router.post("/update", updateConceptoHandler);

router.post("/delete", deleteConceptoHandler);

router.get("/all/:viajeId", fetchConceptosFromViajeHandler);

router.get("/all/viaje", fetchConceptosGroupedByViajeHandler);

router.get("/all/categoria", fetchConceptosGroupedByCategoriaHandler);

export default router;
