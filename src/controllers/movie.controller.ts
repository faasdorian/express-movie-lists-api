import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/database";
import { BadRequestError, InternalServerError } from "../helpers/exceptions";
import { Movie } from "../models/Movie";


export const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const movieRepository = queryRunner.manager.getRepository(Movie);
    const movie = new Movie();
    movie.title = title;
    movie.addedBy = req.user!.username;
    movieRepository.save(movie);
    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(201).json({ message: "Movie created successfully" });
  }
  catch (error) {
    await queryRunner.rollbackTransaction();
    return next(new InternalServerError(error as Error));
  }
}

export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.params.page) || 0;
  if (page < 0) return next(new BadRequestError("Page number cannot be less than 0"));
  
  const limit = parseInt(req.params.limit) || 10;
  if (limit < 0) return next(new BadRequestError("Limit cannot be less than 0"));

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();

    const movieRepository = queryRunner.manager.getRepository(Movie);
    const movies = await movieRepository.find({ skip: page, take: limit });

    await queryRunner.release();

    return res.status(200).json({ movies });
  } catch (error) {
    await queryRunner.release();
    next(new InternalServerError(error as Error));
  }
}