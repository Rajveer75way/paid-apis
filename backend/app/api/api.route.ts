// src/modules/api/api.route.ts

import { Router } from "express";
import { apiController } from "./api.controller";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
const router = Router();

// Route for creating a new API
router
  .post("/", roleAuth(["ADMIN"]), catchError, apiController.createApi)
  .get(
    "/:id",
    roleAuth(["ADMIN", "USER"]),
    catchError,
    apiController.getApiById
  )
  .get("/", roleAuth(["ADMIN", "USER"]), catchError, apiController.getAllApi)

export default router;
