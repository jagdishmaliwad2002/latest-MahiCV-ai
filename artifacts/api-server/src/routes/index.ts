import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resumesRouter from "./resumes";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resumesRouter);
router.use(aiRouter);

export default router;
