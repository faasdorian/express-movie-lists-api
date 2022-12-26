import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { BadRequestError, InternalServerError, NotFoundError } from "../helpers/exceptions";
import { List } from "../models/List";
import { User } from "../models/User";
import listPrivacyTypes from "../types/listPrivacyTypes";

export const createList = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { title, privacy } = req.body;

  const titleRegex = /^[\w !@#$%^&*,]{3,45}$/
  if (!titleRegex.test(title.trim())) return next(new BadRequestError("Title must be at least 3 characters long and 25 max"));
  if (!listPrivacyTypes.includes(privacy)) return next(new BadRequestError("Invalid privacy type"));

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const listRepository = queryRunner.manager.getRepository(List);
    const userRepository = queryRunner.manager.getRepository(User);

    const list = new List();
    list.title = title.trim();
    list.privacy = privacy;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return next(new NotFoundError("User not found"));
    list.user = user!;

    listRepository.save(list);
    await queryRunner.commitTransaction();

  } catch (error) {
    await queryRunner.rollbackTransaction();
    return next(new InternalServerError());

  } finally {
    await queryRunner.release();
    return res.status(201).json({ message: "List created successfully" });
  }
}

export const getLists = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUserId = req.userId;
  const { page, limit, userId: queryUserId } = req.query;
  const pageNumber = page ? parseInt(page as string) : 1;
  const limitNumber = limit ? parseInt(limit as string) : 10;

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