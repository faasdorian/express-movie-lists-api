import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import listPrivacyTypes from "../types/listPrivacyTypes";
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
    enum: listPrivacyTypes,
    default: "public"
  })
  privacy: string;

  @ManyToOne(() => User, (user) => user.movieLists)
  user: User;

  @OneToMany(() => Item, (item) => item.list)
  items: Item[];
}