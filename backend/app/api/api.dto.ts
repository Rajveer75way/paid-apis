// src/modules/api/api.dto.ts

export class CreateApiDTO {
  api_name: string;
  module: string;
  description: string;
  price_per_request: number;
  is_free?: boolean;
  planId: string;  // To associate API with a plan
}
