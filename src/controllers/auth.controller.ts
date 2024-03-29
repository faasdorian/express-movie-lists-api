import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { BadRequestError, InternalServerError, NotFoundError } from "../helpers/exceptions";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, isAdmin } = req.body;
  const tokenUserRole = req.user?.role ?? "user";

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);

    if (tokenUserRole !== "admin" && isAdmin)
      return next(new BadRequestError("Only admins can create admin users"));

    if (await userRepository.findOne({ where: { username } }))
      return next(new BadRequestError("Username already taken"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.isAdmin = isAdmin;

    await userRepository.save(user);
    await queryRunner.commitTransaction();

    await queryRunner.release();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError(error as Error));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    const userRepository = queryRunner.manager.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });
    queryRunner.release();

    if (!user) return next(new NotFoundError("User not found"));

    const isPasswordCorrect = await bcrypt.compare(password, user!.password);
    if (!isPasswordCorrect) return next(new BadRequestError("Incorrect password"));

    const token = jwt.sign(
      { id: user!.id, username: user!.username, role: user!.isAdmin ? "admin" : "user" },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    await queryRunner.release();
    return next(new InternalServerError(error as Error));
  }
};
