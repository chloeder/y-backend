import { Request, Response } from "express";
import UserService from "../services/user.services";
import FollowService from "../services/follow.services";

export default class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await UserService.getProfile(username);
      res.status(200).json({ message: "Get Profile", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSuggestedUsers(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const suggestedUsers = await UserService.getSuggestedUsers(userId);
      res.status(200).json({ message: "Get Suggested Users", suggestedUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async followUnfollowUser(req: Request, res: Response) {
    try {
      const data = await FollowService.followUnfollowUser(
        req.params.id,
        res.locals.user.id
      );
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const body = {
        ...req.body,
        photoProfile: req.files["photoProfile"]?.[0]?.path,
        coverImage: req.files["coverImage"]?.[0]?.path,
      };

      const data = await UserService.updateProfile(body, res.locals.user.id);
      res.status(200).json({ message: "Update Profile", data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
