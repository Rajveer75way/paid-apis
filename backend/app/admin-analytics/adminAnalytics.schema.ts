import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("admin_analytics")
export class AdminAnalytics {
  @PrimaryGeneratedColumn("uuid")
  analytics_id!: string;

  @Column("int", { default: 0 })
  total_users!: number;

  @Column("decimal", { default: 0, precision: 15, scale: 2 })
  total_revenue!: number;

  @Column("int", { default: 0 })
  total_requests!: number;

  @Column("decimal", { default: 0, precision: 15, scale: 2 })
  monthly_revenue!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
