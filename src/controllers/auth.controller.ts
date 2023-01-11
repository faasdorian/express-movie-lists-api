import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { BadRequestError, InternalServerError, NotFoundError } from "../helpers/exceptions";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);

    if (await userRepository.findOne({ where: { username } }))
      return next(new BadRequestError("Username already taken"));
      
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    await userRepository.save(user);
    await queryRunner.commitTransaction();

    await queryRunner.release();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError());
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  const userRepository = queryRunner.manager.getRepository(User);
  const user = await userRepository.findOne({ where: { username } });
  queryRunner.release();

  if (!user) return next(new NotFoundError("User not found"));

  const isPasswordCorrect = await bcrypt.compare(password, user!.password);
  if (!isPasswordCorrect) return next(new BadRequestError("Incorrect password"));

  const token = jwt.sign(
    { id: user!.id, username: user!.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  return res.status(200).json({ token });
};
