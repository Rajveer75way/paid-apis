import { BaseSchema } from "../common/dto/base.dto";
import { Plan } from "app/plan/plan.schema";
import { ApiRequest } from "app/api-request/apiRequest.schema";
// Updated IUser to match the entity schema
export interface IUser {
  id: string;
  name: string;
  email: string;
  active: boolean;
  role: "USER" | "ADMIN"; // Restrict role to "USER" or "ADMIN"
  plan: Plan;
  balance: number;
  password: string;
  apiRequests: ApiRequest[];
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}


