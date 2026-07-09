import { Router, type IRouter } from "express";
import healthRouter from "./health";
import passportRouter from "./passport";

const router: IRouter = Router();

router.use(healthRouter);
router.use('/passport', passportRouter);

export default router;
