import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../helpers/exceptions";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) return next(new BadRequestError("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    req.user = { id: decoded.id, username: decoded.username, role: decoded.role };

    next();
  } catch (error) {
    return next(new UnauthorizedError());
  }
};

export const verifyJwtNoMandatory = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    req.user = { id: decoded.id, username: decoded.username, role: decoded.role };

    next();
  } catch (error) {
    return next();
  }
}