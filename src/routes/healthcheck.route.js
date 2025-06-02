import { Router } from "express";
import healthCheckController from "../controllers/healthcheck.controller.js";

const healthCheckRouter = Router();

healthCheckRouter.get("/",healthCheckController);

export default healthCheckRouter;