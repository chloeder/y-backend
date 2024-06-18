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

      const users = await prisma.user.findMany({
        where: { id: { not: userId } },
        select: {
          id: true,
          fullName: true,
          username: true,
          photoProfile: true,
        },
        take: 5,
      });

      const filteredUsers = users.filter((user) => {
        return !usersFollowedByMe.followings.some(
          (following) => following.id === user.id
        );
      });

      const suggestedUsers = filteredUsers.slice(0, 4);

      return suggestedUsers;
    } catch (error) {
      throw error;
    }
  }

  static async getUsers(search: string) {
    try {
      if (!search) throw new Error("Search query is required");

      return await prisma.user.findMany({
        where: {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          fullName: true,
          username: true,
          photoProfile: true,
          bio: true,
        },
      });
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

  static async getUserFollowers(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          followers: {
            select: {
              follower: {
                select: {
                  id: true,
                  fullName: true,
                  username: true,
                  photoProfile: true,
                },
              },
            },
          },
          followings: true,
        },
      });

      return user.followers.map((follower) => {
        return {
          ...follower.follower,
          isFollowing: user.followings.some(
            (following) => following.targetId === follower.follower.id
          ),
        };
      });
    } catch (error) {
      throw error;
    }
  }

  static async getUserFollowings(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          followings: {
            select: {
              target: {
                select: {
                  id: true,
                  fullName: true,
                  username: true,
                  photoProfile: true,
                },
              },
            },
          },
          followers: true,
        },
      });

      return user.followings.map((following) => {
        return {
          ...following,
          isFollowing: user.followers.some(
            (follower) => follower.followerId === following.target.id
          ),
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
