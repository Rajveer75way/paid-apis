import { IsInt, IsDecimal } from "class-validator";

export class UpdateAdminAnalyticsDto {
  @IsInt()
  total_users!: number;

  @IsDecimal({ force_decimal: true }, { message: "Total revenue must be a decimal value" })
  total_revenue!: number;

  @IsInt()
  total_requests!: number;

  @IsDecimal({ force_decimal: true }, { message: "Monthly revenue must be a decimal value" })
  monthly_revenue!: number;
}
