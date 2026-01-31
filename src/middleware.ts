import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const decode = jwt.verify(header as string, JWT_PASSWORD);
  if (decode) {
    //@ts-ignore
    req.userId = decode.id;
    next();
  } else {
    return res.status(403).json({
      messsage: "You're not logged in",
    });
  }
};

//overide the types of express request object
