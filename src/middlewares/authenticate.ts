import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHandler";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    res.locals.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};
