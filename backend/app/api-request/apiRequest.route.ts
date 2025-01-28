// src/modules/api-request/apiRequest.route.ts
import { Router } from "express";
import * as ApiRequestController from "./apiRequest.controller";
import { roleAuth } from "../common/middleware/role-auth.middleware";


const router = Router();

// Route to create a new API request
router
    .post("/", roleAuth(["USER", "ADMIN"]), ApiRequestController.createApiRequest)
    .get("/",roleAuth([ "ADMIN"]), ApiRequestController.getAllApiRequests)
    .get("/:requestId",roleAuth(["ADMIN"]), ApiRequestController.getApiRequestById)

export default router;
