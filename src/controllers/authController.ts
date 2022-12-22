import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { BadRequestError, InternalServerError, NotFoundError } from "../helpers/exceptions";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  if (!usernameRegex.test(username))
    return next(new BadRequestError("Username must be 3-20 alphanumeric characters"));

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password))
    return next(new BadRequestError(
      "Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    ));

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

  } catch (err) {
    await queryRunner.rollbackTransaction();
    return next(new InternalServerError());
  } finally {
    await queryRunner.release();
    return res.status(201).json({ message: "User created successfully" });
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
