import { BaseSchema } from "../common/dto/base.dto";

// Updated IUser to match the entity schema
export interface IUser extends BaseSchema {
  id?: string;  // Optional for new users (use 'id' instead of '_id')
  name: string;
  email: string;
  active?: boolean;  // Optional, default value can be handled in the schema
  role: "USER" | "ADMIN";
  password: string;
  refreshToken?: string | null;  // Allow refreshToken to be nullable
}
