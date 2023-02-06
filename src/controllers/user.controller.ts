import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { BadRequestError, InternalServerError, NotFoundError } from "../helpers/exceptions";


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const tokenUserRole = req.user?.role ?? "user";

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);
    const user = await userRepository.findOneBy({ id });

    if (!user) return next(new NotFoundError("User not found"));

    if (tokenUserRole !== "admin" && user.id !== req.user?.id)
      return next(new BadRequestError("You can only delete your own account"));

    await userRepository.softDelete(user.id);
    await queryRunner.commitTransaction();

    await queryRunner.release();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    return next(new InternalServerError(error as Error));
  }
}
