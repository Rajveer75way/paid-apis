// src/modules/api-request/apiRequest.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../user/user.schema";
import { Api } from "../api/api.schema";

@Entity("api_requests")
export class ApiRequest {
  @PrimaryGeneratedColumn("uuid")
  request_id!: string;

  @ManyToOne(() => User, (user) => user.apiRequests)
  user!: User;

  @ManyToOne(() => Api, (api) => api.apiRequests)
  api!: Api;

  @CreateDateColumn()
  request_date!: Date;

  @Column("decimal")
  cost!: number;
}
