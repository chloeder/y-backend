import j from "joi";

export const updateProfileSchema = j.object({
  fullName: j.string().min(6).max(30).optional().messages({
    "string.base": "Full name must be a string",
    "string.min": "Full name must be at least 6 characters",
    "string.max": "Full name must be at most 30 characters",
  }),
  username: j.string().min(6).max(30).optional().messages({
    "string.base": "Full name must be a string",
    "string.min": "Full name must be at least 6 characters",
    "string.max": "Full name must be at most 30 characters",
  }),
  bio: j.string().min(6).max(50).optional().messages({
    "string.base": "Full name must be a string",
    "string.min": "Full name must be at least 6 characters",
    "string.max": "Full name must be at most 50 characters",
  }),
  photoProfile: j.allow(null),
  coverImage: j.allow(null),
});
