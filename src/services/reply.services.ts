import { prisma } from "../db/prisma";
import { replySchema } from "../validators/reply.validators";
import { CreateReplyDto } from "../dtos/reply.dto";
import { cloudinaryUpload } from "../utils/cloudinaryHandler";

export default class ReplyService {
  static async createReply(
    dto: CreateReplyDto,
    userId: string,
    threadId: string
  ) {
    try {
      const thread = await prisma.thread.findUnique({
        where: {
          id: threadId,
        },
      });
      if (!thread) throw new Error("Thread not found");

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new Error("User not found");

      const replyData = replySchema.validate(dto);
      if (replyData.error) throw new Error(replyData.error.message);

      // Cloudinary upload
      const cloudinaryImage = dto.image
        ? await cloudinaryUpload(dto.image)
        : null;

      return await prisma.reply.create({
        data: {
          ...dto,
          image: cloudinaryImage?.secure_url,
          userId,
          threadId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getReplies(threadId: string) {
    try {
      const thread = await prisma.thread.findUnique({
        where: {
          id: threadId,
        },
      });
      if (!thread) throw new Error("Thread not found");

      return await prisma.reply.findMany({
        where: {
          threadId,
        },
        include: {
          users: {
            select: {
              fullName: true,
              username: true,
              photoProfile: true,
            },
          },
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
