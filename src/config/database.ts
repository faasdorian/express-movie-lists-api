import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { List } from "../models/List";
import { Item } from "../models/Item";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Movie, List, Item],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize().catch((error) => console.error(error));
