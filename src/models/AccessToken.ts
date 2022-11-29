import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.accessTokens)
  user: User;

  @Column({ type: "timestamp" })
  tokenExpires: Date;
}
