import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Movie } from "./Movie";
import { List } from "./List";


@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  checked: boolean;
  
  @ManyToOne(() => List, (list) => list.items)
  list: List;

  @ManyToOne(() => Movie)
  movie: Movie;
}