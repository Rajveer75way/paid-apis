import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseSchema {
  @ObjectIdColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

 
}

