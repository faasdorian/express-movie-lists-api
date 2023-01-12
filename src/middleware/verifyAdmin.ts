import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../helpers/exceptions";


export default (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") return next(new ForbiddenError());
  next();
}