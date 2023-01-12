import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Item } from "./Item";
import { User } from "./User";

@Entity()
export class List {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({
    type: "enum",
    enum: ['public', 'private'],
    default: "public"
  })
  privacy: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.movieLists)
  user: User;

  @OneToMany(() => Item, (item) => item.list)
  items: Item[];
}