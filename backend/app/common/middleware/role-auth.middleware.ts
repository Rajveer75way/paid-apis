import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { type IUser } from "../../user/user.dto";

export const roleAuth = (
  roles: IUser['role'][],   
  publicRoutes: string[] = []  
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        return next();
      }

      // Extract token from Authorization header
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        throw createHttpError(401, { message: "Token not provided" });
      }

      try {
        // Verify token and decode user
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
        req.user = decodedUser;  // Attach user to the request
        const user = req.user as IUser;

        // Check if user role exists and is valid
        if (!user.role || !roles.includes(user.role)) {
          throw createHttpError(403, { message: "You do not have access to this resource" });
        }

        // Proceed to next middleware or route handler
        next();
      } catch (error) {
        throw createHttpError(401, { message: "Invalid or expired token" });
      }
    }
  );
