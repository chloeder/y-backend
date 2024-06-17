import { prisma } from "../../db/prisma";

export default class FollowService {
  static async followUnfollowUser(targetId: string, ownerId: string) {
    try {
      const userToModify = await prisma.user.findUnique({
        where: { id: targetId },
      });

      const currentUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (userToModify.id === currentUser.id)
        throw new Error("Cannot follow yourself");

      if (!userToModify || !currentUser) throw new Error("User not found");

      const isFollowing = await prisma.follow.findFirst({
        where: {
          followerId: currentUser.id,
          targetId: userToModify.id,
        },
      });

      if (isFollowing) {
        await prisma.follow.delete({
          where: {
            id: isFollowing.id,
          },
        });
        return "Unfollowed successfully";
      } else {
        await prisma.follow.create({
          data: {
            follower: {
              connect: {
                id: currentUser.id,
              },
            },
            target: {
              connect: {
                id: userToModify.id,
              },
            },
          },
        });
        return "Followed successfully";
      }
    } catch (error) {
      throw error;
    }
  }
}
