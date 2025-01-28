// src/modules/api-request/apiRequest.dto.ts
export class CreateApiRequestDto {
  userId: string;
  apiId: string;
  cost: number;
}
export class ApiRequestResponseDto {
  request_id: string;
  userId: string;
  apiId: string;
  request_date: Date;
  cost: number;
}

