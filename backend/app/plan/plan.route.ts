import { Router } from "express";
import { PlanController } from "./plan.controller";
import { catchError } from "../common/middleware/cath-error.middleware";
import { validatePlan } from "./plan.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";
const router = Router();
const planController = new PlanController();

// Routes
router
  .post(
    "/",
    validatePlan,
    roleAuth(["ADMIN"]),
    catchError,
    planController.createPlan
  )
  .get("/", roleAuth(["ADMIN", "USER"]), catchError, planController.getPlans)
  .get("/:id", roleAuth(["ADMIN", "USER"]), catchError, planController.getPlan)
  .put(
    "/:id",
    validatePlan,
    roleAuth(["ADMIN"]),
    catchError,
    planController.updatePlan
  )
  .delete("/:id", roleAuth(["ADMIN"]), catchError, planController.deletePlan);

export default router;
