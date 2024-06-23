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
      const accessToken = generateToken(user, "1d");

      if (process.env.NODE_ENV === "production") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
      }

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          path: "/",
          domain: "localhost",
          secure: false,
          sameSite: "lax",
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
      res.clearCookie("jwt", { sameSite: "none", secure: true });
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async checkAuth(req: Request, res: Response) {
    // Check if user is authenticated
    try {
      res.json(res.locals.user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      await AuthService.forgotPassword(req.body.email);
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      await AuthService.resetPassword(req.body, req.params.token);
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
