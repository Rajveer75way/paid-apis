import { IUser } from './user/user.dto'; // Adjust the import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // This ensures that req.user is recognized as IUser type
    }
  }
}
