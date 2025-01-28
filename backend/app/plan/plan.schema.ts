import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Api } from "../api/api.schema";
import { User } from "../user/user.schema";

@Entity("plans")
export class Plan {
  @PrimaryGeneratedColumn("uuid")
  plan_id!: string;

  @Column()
  plan_name!: string;

  @Column("decimal")
  price_per_request!: number;

  @Column("int", { default: 0 })
  free_requests!: number;

  @Column("text", { nullable: true })
  description!: string;

  @OneToMany(() => Api, (api) => api.plan)
  apis!: Api[];

  @OneToMany(() => User, (user) => user.plan)
  users!: User[];
}
