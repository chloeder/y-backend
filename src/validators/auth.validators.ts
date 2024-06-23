import j from "joi";

export const loginSchema = j.object({
  email: j.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: j.string().alphanum().required().messages({
    "string.base": "Password must be a string",
    "string.alphanum": "Username must be alphanumeric",
    "any.required": "Username is required",
  }),
});

export const registerSchema = j.object({
  username: j.string().required().min(3).max(20).messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be at most 20 characters",
    "any.required": "Username is required",
  }),
  fullName: j.string().required().min(3).max(50).messages({
    "string.base": "Full name must be a string",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must be at most 50 characters",
    "any.required": "Full name is required",
  }),
  email: j.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: j.string().required().min(6).max(20).messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be at most 20 characters",
    "any.required": "Password is required",
  }),
  photoProfile: j.string().optional(),
  bio: j.string().min(3).max(100).optional().messages({
    "string.base": "Bio must be a string",
    "string.min": "Bio must be at least 3 characters",
    "string.max": "Bio must be at most 100 characters",
  }),
});

export const forgotPasswordSchema = j.object({
  email: j.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
});

export const resetPasswordSchema = j.object({
  password: j.string().required().min(6).max(20).messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be at most 20 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: j.string().required().valid(j.ref("password")).messages({
    "string.base": "Confirm password must be a string",
    "any.required": "Confirm password is required",
    "any.only": "Passwords do not match",
  }),
});
