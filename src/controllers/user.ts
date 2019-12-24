import { Request, Response } from "express";

export const createUser = (req: Request, res: Response) => {
  res.send({ message: "Create User" });
};

export const readUser = (req: Request, res: Response) => {
  res.send({ message: "Read User" });
};

export const listUsers = (req: Request, res: Response) => {
  res.send({ message: "List User" });
};
