import { prisma } from "../../db/prisma";
import { replySchema } from "../../validators/reply.validators";
import { CreateReplyDto } from "../dtos/reply.dto";
import { cloudinaryUpload } from "../utils/cloudinaryHandler";

export default class ReplyService {
  static async createReply(
    dto: CreateReplyDto,
    userId: string,
    threadId: string
  ) {
    try {
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
      throw new Error(error);
    }
  }

  static async getReplies(threadId: string) {
    try {
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
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
