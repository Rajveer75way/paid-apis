import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";
const router = Router();

router
    .post("/login", userValidator.loginUser, catchError, userController.loginUser)
    .post("/", userValidator.createUser, catchError, userController.createUser)
    .post('/createPassword', userValidator.createUpdatePassword, catchError, userController.createUpdatePassword)
    .post('/registered',
      roleAuth(["ADMIN"]),
      catchError,
      userController.handleGetRegisteredUsers
    )
    .get("/active-session", roleAuth(['ADMIN']), userController.getActiveUserCount)
    .post('/refresh-token', userController.refreshToken)
export default router;
