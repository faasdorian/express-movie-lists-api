import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { List } from "./List";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  updatedAt: Date;

  @OneToMany(() => List, (movieList) => movieList.user)
  movieLists: List[];
}
