import { IsString, IsDecimal, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

// DTO for Plan
export class PlanDTO {
  @IsUUID()
  @IsOptional() // Optional, for update operations
  plan_id?: string;

  @IsString()
  @IsNotEmpty()
  plan_name!: string;

  @IsDecimal()
  @IsNotEmpty()
  price_per_request!: number;

  @IsOptional()
  @IsDecimal()
  free_requests?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
