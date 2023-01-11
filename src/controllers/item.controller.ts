import { NextFunction, Request, Response } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../config/database";
import { ForbiddenError, InternalServerError, NotFoundError } from "../helpers/exceptions";
import { Item } from "../models/Item";
import { List } from "../models/List";
import { Movie } from "../models/Movie";


export const addItemsToList = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { moviesIds, listId } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const listRepository = queryRunner.manager.getRepository(List);

    const list = await listRepository.findOne({ where: { id: listId }, relations: ['user', 'items', 'items.movie'] });
    if (!list) return next(new NotFoundError("List not found"));

    if (list.user.id !== userId) return next(new ForbiddenError());

    if (list.items.length + moviesIds.length > 50) return next(new ForbiddenError("You can't add more than 50 items to a list"));

    const movieRepository = queryRunner.manager.getRepository(Movie);
    const movies = await movieRepository.find({ where: { id: In(moviesIds) } });

    const items: Item[] = [];
    movies.forEach(movie => {
      const movieInList = list.items.find(item => item.movie.id === movie.id);
      if (!movieInList) {
        const item = new Item();
        item.movie = movie;
        item.list = list;
        item.createdAt = new Date();

        items.push(item);
      }
    });

    const itemsRepository = queryRunner.manager.getRepository(Item);
    await itemsRepository.save(items);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(200).json({ message: "Items added successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError(error as Error));
  }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { itemId } = req.params;
  const { watched } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const itemRepository = queryRunner.manager.getRepository(Item);
    const item = await itemRepository.findOne({ where: { id: itemId }, relations: ['list', 'list.user'] });
    if (!item) return next(new NotFoundError("Item not found"));

    if (!item.list) return next(new NotFoundError("List not found"));

    if (item.list.user.id !== userId) return next(new ForbiddenError());

    item.watched = watched ?? item.watched;
    await itemRepository.save(item);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError(error as Error));
  }
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { itemId } = req.params;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const itemRepository = queryRunner.manager.getRepository(Item);
    const item = await itemRepository.findOne({ where: { id: itemId }, relations: ['list', 'list.user'] });

    if (!item) return next(new NotFoundError("Item not found"));
    if (!item.list) return next(new NotFoundError("List not found"));

    if (item.list.user.id !== userId) return next(new ForbiddenError());

    await itemRepository.remove(item);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError(error as Error));
  }
}