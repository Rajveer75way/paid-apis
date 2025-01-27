// report.schema.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  userID: number;

  @Column({ type: 'enum', enum: ['monthly', 'yearly'] })
  type: 'monthly' | 'yearly';

  @Column()
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

