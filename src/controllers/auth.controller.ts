import { Request, Response } from "express";
import AuthService from "../services/auth.services";
import { generateRefreshToken, generateToken } from "../utils/jwtHandler";

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      await AuthService.register(req.body);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const user = await AuthService.login(req.body);

      // access token
      const accessToken = generateToken(user);

      if (process.env.NODE_ENV === "production") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
      }

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          // can only be accessed by server requests
          httpOnly: true,
          // path = where the cookie is valid
          path: "/",
          // domain = what domain the cookie is valid on
          domain: "localhost",
          // secure = only send cookie over https
          secure: false,
          // sameSite = only send cookie if the request is coming from the same origin
          sameSite: "lax", // "strict" | "lax" | "none" (secure must be true)
          // maxAge = how long the cookie is valid for in milliseconds
          maxAge: 3600000, // 1 hour
        });
      }

      res
        .status(200)
        .json({ message: "User logged in successfully", user, accessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async checkAuth(req: Request, res: Response) {
    // Check if user is authenticated
    try {
      res.json(res.locals.user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
}
