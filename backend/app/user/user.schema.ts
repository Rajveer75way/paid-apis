import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne,
  OneToMany, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcrypt";
import { Plan } from "../plan/plan.schema";
import { ApiRequest } from "../api-request/apiRequest.schema";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  active: boolean;

  @Column()
  role: string;

  @Column()
  password: string;

  @ManyToOne(() => Plan, (plan) => plan.users)
  plan!: Plan;

  @Column("decimal", { default: 0 })
  balance!: number;

  @OneToMany(() => ApiRequest, (apiRequest) => apiRequest.user)
  apiRequests!: ApiRequest[];


  @Column({ type: "text", nullable: true })  
  refreshToken: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Check if password is being updated or inserted
    if (this.password && !this.isPasswordAlreadyHashed()) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Helper method to check if the password is already hashed
  private isPasswordAlreadyHashed() {
    // Assuming the password doesn't start with a "$" symbol unless it's hashed (bcrypt hashes start with $)
    return this.password && this.password.startsWith('$');
  }
}
