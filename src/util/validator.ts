import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const checkParams = (req: Request, res: Response, next: NextFunction) => {
  const errorHandler = validationResult(req);

  if (errorHandler.isEmpty()) {
    next();
  } else {
    res.status(400).send({ errors: errorHandler.array() });
  }
};
