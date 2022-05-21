import { Router } from "express";
import { onGetCountryController } from "../controller/countries";

const router = Router();

router.get('/get', onGetCountryController);

export default router;