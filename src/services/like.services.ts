import { prisma } from "../../db/prisma";

export default class LikeService {
  static async likeUnlikeThread(threadId: string, userId: string) {
    try {
      const threadExists = await prisma.thread.findUnique({
        where: {
          id: threadId,
        },
      });
      if (!threadExists) throw new Error("Thread not found");

      const userExists = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userExists) throw new Error("User not found");

      const thread = await prisma.thread.findUnique({
        where: {
          id: threadId,
        },
        include: {
          likes: true,
        },
      });

      const isLiked = thread.likes.some((like) => like.userId === userId);
      if (isLiked) {
        await prisma.like.deleteMany({
          where: {
            threadId,
            userId,
          },
        });
        return "Unliked Thread successfully";
      } else {
        await prisma.like.create({
          data: {
            userId,
            threadId,
          },
        });
        return "Liked Thread successfully";
      }
    } catch (error) {
      throw error;
    }
  }
}
