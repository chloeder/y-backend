import { prisma } from "../db/prisma";
import { updateProfileSchema } from "../validators/user.validator";
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
          fullName: true,
          username: true,
          email: true,
          bio: true,
          photoProfile: true,
          coverImage: true,
          followers: true,
          followings: true,
          createdAt: true,
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
          followings: {
            select: {
              followerId: true,
            },
          },
        },
      });

      const filteredUsers = users.filter((user) => {
        return !usersFollowedByMe.followings.some(
          (following) => following.targetId === user.id
        );
      });

      return filteredUsers.slice(0, 5);
    } catch (error) {
      throw error;
    }
  }

  static async getUsers(search: string) {
    try {
      const users = await prisma.user.findMany({
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
          followings: {
            select: {
              followerId: true,
            },
          },
        },
      });

      return users.map((user) => {
        return {
          ...user,
          isFollowing: user.followings.some(
            (following) => following.followerId === user.id
          ),
        };
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
        const photoProfile = await cloudinaryUpload(dto.photoProfile);
        dto.photoProfile = photoProfile?.secure_url;
      }

      if (dto.coverImage) {
        if (user.coverImage) {
          await cloudinaryDelete(user.coverImage);
        }
        const coverImage = await cloudinaryUpload(dto.coverImage);
        dto.coverImage = coverImage?.secure_url;
      }

      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      console.log(error);

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
      // return user;
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
              followerId: true,
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
        },
      });
      // return user;
      return user.followings.map((following) => {
        return {
          ...following.target,
          isFollowing: following.followerId === userId,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
