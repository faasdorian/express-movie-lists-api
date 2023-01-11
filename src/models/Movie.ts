import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  title: string;

}