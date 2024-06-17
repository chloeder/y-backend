import { Request, Response } from "express";
import ThreadService from "../services/thread.services";
import ReplyService from "../services/reply.services";
import LikeService from "../services/like.services";

export default class ThreadController {
  // Thread CRUD
  static async createThread(req: Request, res: Response) {
    try {
      const body = {
        ...req.body,
        image: req.file?.path,
      };
      await ThreadService.createThread(body, res.locals.user.id);
      res.status(201).json({ message: "Thread created successfully" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async getThread(req: Request, res: Response) {
    try {
      const threads = await ThreadService.getThread(res.locals.user.id);
      res.status(200).json(threads);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async updateThread(req: Request, res: Response) {
    try {
      const body = {
        ...req.body,
        image: req.file?.path,
      };
      const thread = await ThreadService.updateThread(body, req.params.id);
      res.status(200).json({ message: "Thread updated successfully", thread });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async deleteThread(req: Request, res: Response) {
    try {
      await ThreadService.deleteThread(req.params.id);
      res.status(200).json({ message: "Thread deleted successfully" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async getThreadById(req: Request, res: Response) {
    try {
      const thread = await ThreadService.getThreadById(req.params.id);
      res.status(200).json(thread);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async getLikedThread(req: Request, res: Response) {
    try {
      const data = await ThreadService.getLikedThread(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async getFollowingThread(req: Request, res: Response) {
    res.send("Get following thread");
  }

  // Reply Thread CR
  static async replyThread(req: Request, res: Response) {
    try {
      const body = {
        ...req.body,
        image: req.file?.path,
      };
      const data = await ReplyService.createReply(
        body,
        res.locals.user.id,
        req.params.id
      );
      res.status(201).json({ message: "Thread replied successfully", data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async getReplyThread(req: Request, res: Response) {
    try {
      const replies = await ReplyService.getReplies(req.params.id);
      res.status(200).json({ message: "Thread replied successfully", replies });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // Like Thread
  static async likeUnlikeThread(req: Request, res: Response) {
    try {
      const data = await LikeService.likeUnlikeThread(
        req.params.id,
        res.locals.user.id
      );
      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}
