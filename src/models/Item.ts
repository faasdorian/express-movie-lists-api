import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Movie } from "./Movie";
import { List } from "./List";


@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "boolean", default: false })
  watched: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  
  @ManyToOne(() => List, (list) => list.items)
  list: List;

  @ManyToOne(() => Movie)
  movie: Movie;
}