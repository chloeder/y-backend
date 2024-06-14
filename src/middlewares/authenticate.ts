import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHandler";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.accessToken;
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
