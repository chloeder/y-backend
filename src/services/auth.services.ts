import { prisma } from "../../db/prisma";
import { loginSchema, registerSchema } from "../../validators/auth.validators";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { comparePassword, hashPassword } from "../utils/bcryptHandler";

export default class AuthService {
  static async register(dto: RegisterDTO) {
    try {
      // Validate the users input & throw error if invalid
      const validateData = registerSchema.validate(dto);
      if (validateData.error) throw new Error(validateData.error.message);

      // Check if username already exists
      const username = await prisma.user.findUnique({
        where: {
          username: dto.username,
        },
      });
      if (username) throw new Error("Username already exists");

      // Check if email already exists
      const email = await prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (email) throw new Error("Email already exists");

      // Hash password
      const hashedPassword = await hashPassword(dto.password);

      // Create user
      return await prisma.user.create({
        data: {
          fullName: dto.fullName,
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async login(dto: LoginDTO) {
    try {
      // Validate the users input & throw error if invalid
      const validateData = loginSchema.validate(dto);
      if (validateData.error) throw new Error(validateData.error.message);

      // Check if user exists in our database
      const user = await prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        include: {
          followers: true,
          followings: true,
        },
      });
      if (!user) throw new Error("Credentials are not found in our records");

      // Compare password
      const isPasswordCorrect = await comparePassword(
        user.password,
        dto.password
      );
      if (!isPasswordCorrect) throw new Error("Password is invalid");

      const userLoggedIn = {
        ...user,
        followers: user.followers.length,
        followings: user.followings.length,
      };
      return userLoggedIn;
    } catch (error) {
      throw error;
    }
  }
}
