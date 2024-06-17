import { prisma } from "../../db/prisma";
import { updateProfileSchema } from "../../validators/user.validator";
import { UserProfileDto } from "../dtos/user.dto";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinaryHandler";

export default class UserService {
  static async getProfile(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          photoProfile: true,
          followers: true,
          followings: true,
        },
      });

      return {
        ...user,
        followers: user.followers.length,
        followings: user.followings.length,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getSuggestedUsers(userId: string) {
    try {
      const usersFollowedByMe = await prisma.user.findUnique({
        where: { id: userId },
        select: { followings: true },
      });
      console.log("usersFollowedByMe", usersFollowedByMe);

      const users = await prisma.user.findMany({
        where: { id: { not: userId } },
        take: 5,
      });
      console.log("users", users);

      const filteredUsers = users.filter((user) => {
        return !usersFollowedByMe.followings.some(
          (following) => following.id === user.id
        );
      });
      console.log("filteredUsers", filteredUsers);

      const suggestedUsers = filteredUsers.slice(0, 4);
      console.log("suggest user", suggestedUsers);
      return suggestedUsers;
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(dto: UserProfileDto, userId: string) {
    try {
      const userValidate = updateProfileSchema.validate(dto);
      if (userValidate.error) throw new Error(userValidate.error.message);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new Error("User not found");

      if (dto.photoProfile) {
        if (user.photoProfile) {
          await cloudinaryDelete(user.photoProfile);
        }
        const photoProfile = dto.photoProfile
          ? await cloudinaryUpload(dto.photoProfile)
          : null;
        dto.photoProfile = photoProfile?.secure_url;
      }

      if (dto.photoProfile) {
        if (user.coverImage) {
          await cloudinaryDelete(user.coverImage);
        }
        const coverImage = dto.coverImage
          ? await cloudinaryUpload(dto.coverImage)
          : null;
        dto.coverImage = coverImage?.secure_url;
      }

      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
