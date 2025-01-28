import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Plan } from "../plan/plan.schema";
import { ApiRequest } from "../api-request/apiRequest.schema";

@Entity("apis")
export class Api {
  @PrimaryGeneratedColumn("uuid")
  api_id!: string;

  @Column()
  api_name!: string;

  @Column()
  module!: string;

  @Column("text")
  description!: string;

  @Column("decimal")
  price_per_request!: number;

  @Column("boolean", { default: false })
  is_free!: boolean;

  @ManyToOne(() => Plan, (plan) => plan.apis)
  plan!: Plan;

  // Add this relationship
  @OneToMany(() => ApiRequest, (apiRequest) => apiRequest.api)
  apiRequests!: ApiRequest[];
}
