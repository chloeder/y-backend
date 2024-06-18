import { prisma } from "../../db/prisma";
import { threadSchema } from "../../validators/thread.validators";
import { CreateThreadDto, UpdateThreadDto } from "../dtos/thread.dto";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinaryHandler";

export default class ThreadService {
  static async createThread(dto: CreateThreadDto, userId: string) {
    try {
      // Validate user input fields & throw error if not valid
      const threadData = threadSchema.validate(dto);
      if (threadData.error) throw new Error(threadData.error.message);

      // Cloudinary upload
      const cloudinaryImage = dto.image
        ? await cloudinaryUpload(dto.image)
        : null;

      // Create thread
      return await prisma.thread.create({
        data: {
          ...dto,
          image: cloudinaryImage?.secure_url,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getThread(userId: string) {
    try {
      const threads = await prisma.thread.findMany({
        take: 25,
        select: {
          id: true,
          content: true,
          image: true,
          users: {
            select: {
              id: true,
              username: true,
              fullName: true,
              photoProfile: true,
            },
          },
          createdAt: true,
          likes: true,
          replies: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const threadsWithLikeStatus = threads.map((thread) => {
        return {
          ...thread,
          likes: thread.likes.length,
          replies: thread.replies.length,
          isLiked: thread.likes.some((like) => like.userId === userId),
        };
      });

      return threadsWithLikeStatus;
    } catch (error) {
      throw error;
    }
  }

  static async updateThread(dto: UpdateThreadDto, id: string) {
    try {
      // Find the thread to be updated
      const thread = await prisma.thread.findUnique({
        where: {
          id,
        },
      });
      if (!thread) throw new Error("Thread not found");

      if (dto.image) {
        if (thread.image) {
          // Cloudinary delete
          await cloudinaryDelete(thread.image);
        }
        // Cloudinary upload
        const cloudinaryImage = dto.image
          ? await cloudinaryUpload(dto.image)
          : null;
        dto.image = cloudinaryImage?.secure_url;
      }
      return await prisma.thread.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteThread(id: string) {
    try {
      // Find the thread to be deleted
      const thread = await prisma.thread.findUnique({
        where: {
          id,
        },
      });
      if (!thread) throw new Error("Thread not found");

      return await prisma.thread.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getThreadById(id: string, userId: string) {
    try {
      const thread = await prisma.thread.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          content: true,
          image: true,
          users: {
            select: {
              id: true,
              username: true,
              fullName: true,
              photoProfile: true,
            },
          },
          createdAt: true,
          likes: true,
          replies: true,
        },
      });
      if (!thread) throw new Error("Thread not found");

      const threadWithLikeStatus = {
        ...thread,
        likes: thread.likes.length,
        replies: thread.replies.length,
        isLiked: thread.likes.some((like) => like.userId === userId),
      };
      return threadWithLikeStatus;
    } catch (error) {
      throw error;
    }
  }

  static async getLikedThread(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new Error("User not found");

      const likedThread = await prisma.like.findMany({
        where: {
          userId,
        },
        select: {
          thread: {
            select: {
              id: true,
              content: true,
              image: true,
              users: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  photoProfile: true,
                },
              },
              createdAt: true,
              likes: true,
              replies: true,
            },
          },
        },
      });

      return likedThread.map((thread) => {
        return {
          ...thread.thread,
          likes: thread.thread.likes.length,
          replies: thread.thread.replies.length,
          isLiked: thread.thread.likes.some((like) => like.userId === userId),
        };
      });
    } catch (error) {
      throw error;
    }
  }

  static async getFollowingThread(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followings: true,
        },
      });
      if (!user) throw new Error("User not found");

      return await prisma.thread.findMany({
        where: {
          userId: {
            in: user.followings.map((following) => following.targetId),
          },
        },
        select: {
          id: true,
          content: true,
          image: true,
          users: {
            select: {
              id: true,
              username: true,
              fullName: true,
              photoProfile: true,
            },
          },
          createdAt: true,
          likes: true,
          replies: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
