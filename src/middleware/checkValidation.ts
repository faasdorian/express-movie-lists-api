import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../helpers/exceptions";

export default (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty())
    return next(new BadRequestError(validationErrors.array().map(it => { return it.msg })));
  else
    next();
}