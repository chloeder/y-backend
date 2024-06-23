import { prisma } from "../db/prisma";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validators";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { comparePassword, hashPassword } from "../utils/bcryptHandler";
import { sendEmail } from "../utils/mailHandler";
import { generateToken, verifyToken } from "../utils/jwtHandler";

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
          username: dto.username,
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

      // access token
      const token = generateToken(user, "1d");

      const userLoggedIn = {
        ...user,
        followers: user.followers.length,
        followings: user.followings.length,
        token,
      };
      return userLoggedIn;
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(email: string) {
    try {
      const validateData = forgotPasswordSchema.validate({ email });
      if (validateData.error) throw new Error(validateData.error.message);

      // Check if user exists in our database
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) throw new Error("Email is not found in our records");

      delete user.password;
      const token = generateToken(user, "1h");
      await prisma.passwordResetToken.create({
        data: {
          token,
          expiresAt: new Date(Date.now() + 3600000),
          userId: user.id,
        },
      });

      // Send email
      await sendEmail({
        email: user.email,
        subject: "Forgot Password",
        name: user.fullName,
        resetLink: `${
          process.env.NODE_ENV === "production"
            ? process.env.CLIENT_URL
            : "http://localhost:5173"
        }/reset-password/${token}`,
      });
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(dto: { password: string }, token: string) {
    try {
      const validateData = resetPasswordSchema.validate(dto);
      if (validateData.error) throw new Error(validateData.error.message);

      const tokenEntry = await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
      });
      if (
        !tokenEntry ||
        tokenEntry.isUsed ||
        tokenEntry.expiresAt < new Date()
      ) {
        throw new Error("Token is invalid or expired");
      }

      const decoded = verifyToken(tokenEntry.token);
      const hashedPassword = await hashPassword(dto.password);

      await prisma.passwordResetToken.update({
        where: {
          token,
        },
        data: {
          isUsed: true,
        },
      });

      await prisma.user.update({
        where: {
          id: decoded.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
