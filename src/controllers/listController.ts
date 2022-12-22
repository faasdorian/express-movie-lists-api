import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { BadRequestError, InternalServerError, NotFoundError } from "../helpers/exceptions";
import { List } from "../models/List";
import { User } from "../models/User";
import listPrivacyTypes from "../types/listPrivacyTypes";

export const createList = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  const { title, privacy } = req.body;

  const titleRegex = /\w{3,}/
  if (!titleRegex.test(title)) return next(new BadRequestError("Title must be at least 3 characters long"));
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