import { body } from "express-validator";

export const validatePlan = [
  body("plan_name").isString().notEmpty(),
  body("price_per_request").isDecimal().notEmpty(),
  body("free_requests").optional().isDecimal(),
  body("description").optional().isString(),
];
