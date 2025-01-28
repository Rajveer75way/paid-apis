import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";
const router = Router();

router
    .post("/login", userValidator.loginUser, catchError, userController.loginUser)
    .post("/", userValidator.createUser, catchError, userController.createUser)
    .post('/registered',
      roleAuth(["ADMIN"]),
      catchError,
      userController.handleGetRegisteredUsers
    )
    .post('/refresh-token', userController.refreshToken)
    .post('/subscribe',roleAuth(['USER', 'ADMIN']), catchError, userController.subscribeToPlan)
    .get('/id', roleAuth(["ADMIN", "USER"]), catchError, userController.getUserById)
export default router;
