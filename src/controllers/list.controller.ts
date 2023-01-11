import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ForbiddenError, InternalServerError, NotFoundError } from "../helpers/exceptions";
import { Item } from "../models/Item";
import { List } from "../models/List";
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
    return next(new InternalServerError(error as Error));
  }
}

export const updateList = async (req: Request, res: Response, next: NextFunction) => {
  const { listId } = req.params;
  const { userId } = req;
  const { title, privacy } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const listRepository = queryRunner.manager.getRepository(List);
    const list = await listRepository.findOne({ where: { id: listId }, relations: ['user'] });
    if (!list) return next(new NotFoundError("List not found"));

    if (list.user.id !== userId) return next(new ForbiddenError());

    list.title = title ?? list.title;
    list.privacy = privacy ?? list.privacy;

    await listRepository.save(list);
    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(200).json({ message: "List updated successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return next(new InternalServerError(error as Error));
  }
}

export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
  const { listId } = req.params;
  const { userId } = req;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const listRepository = queryRunner.manager.getRepository(List);
    const list = await listRepository.findOne({ where: { id: listId }, relations: ['user'] });
    if (!list) return next(new NotFoundError("List not found"));

    if (list.user.id !== userId) return next(new ForbiddenError());

    const itemRepository = queryRunner.manager.getRepository(Item);
    await itemRepository.delete({ list: list });

    await listRepository.remove(list);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return next(new InternalServerError(error as Error));
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
    next(new InternalServerError(error as Error));
  }
}

export const getListById = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUserId = req.userId;
  const { listId } = req.params;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();

    const listRepository = queryRunner.manager.getRepository(List);
    const list = await listRepository.findOne({ where: { id: listId }, relations: ['user', 'items', 'items.movie'] });
    if (!list) return next(new NotFoundError("List not found"));

    if (list.privacy === 'private' && list.user.id !== tokenUserId) return next(new ForbiddenError());

    return res.status(200).json({ ...list, user: undefined });
  } catch (error) {
    await queryRunner.release();
    next(new InternalServerError(error as Error));
  }
}