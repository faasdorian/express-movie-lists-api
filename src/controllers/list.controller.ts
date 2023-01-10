import { NextFunction, Request, Response } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../config/database";
import { ForbiddenError, InternalServerError, NotFoundError } from "../helpers/exceptions";
import { Item } from "../models/Item";
import { List } from "../models/List";
import { Movie } from "../models/Movie";
import { User } from "../models/User";

export const createList = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { title, privacy } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const listRepository = queryRunner.manager.getRepository(List);
    const userRepository = queryRunner.manager.getRepository(User);

    const list = new List();
    list.title = title;
    list.privacy = privacy;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return next(new NotFoundError("User not found"));
    list.user = user!;

    listRepository.save(list);
    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(201).json({ message: "List created successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return next(new InternalServerError());
  }
}

export const getLists = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUserId = req.userId;
  const { page, limit, userId: queryUserId } = req.query;

  const pageNumber = page ? parseInt(page as string) : 1;
  if (pageNumber < 1) return next(new ForbiddenError("Page number must be greater than 0"));

  const limitNumber = limit ? parseInt(limit as string) : 10;
  if (limitNumber < 1) return next(new ForbiddenError("Limit number must be greater than 0"));

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const query = queryRunner.manager.getRepository(List)
      .createQueryBuilder('list')
      .where('list.userId = :userId', { userId: queryUserId ?? tokenUserId });

    if (queryUserId) query.andWhere('list.privacy = :privacy', { privacy: 'public' });

    const totalCount = await query.getCount();

    const lists = await query
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getMany();

    await queryRunner.release();
    return res.status(200).json({ lists, totalCount, totalPages: Math.ceil(totalCount / limitNumber) });
  } catch (error) {
    await queryRunner.release();
    next(new InternalServerError());
  }
}

export const addItemsToList = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { listId } = req.params;
  const { moviesIds } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const listRepository = queryRunner.manager.getRepository(List);

    const list = await listRepository.findOne({ where: { id: listId }, relations: ['user'] });
    if (!list) return next(new NotFoundError("List not found"));

    if (list.user.id !== userId) return next(new ForbiddenError());

    const movieRepository = queryRunner.manager.getRepository(Movie);
    const movies = await movieRepository.find({ where: { id: In(moviesIds) } });
    if (movies.length !== moviesIds.length) return next(new NotFoundError("Movie not found"));

    const itemsRepository = queryRunner.manager.getRepository(Item);
    const items: Item[] = [];
    movies.forEach(movie => {

      const item = new Item();
      item.movie = movie;
      item.list = list;
      item.createdAt = new Date();

      items.push(item);
    });

    await itemsRepository.save(items);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(200).json({ message: "Items added successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError());
  }
}