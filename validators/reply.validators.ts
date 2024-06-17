import j from "joi";

export const replySchema = j.object({
  content: j.string().min(6).max(250).required().messages({
    "string.base": "Content must be a string",
    "string.min": "Content must be at least 6 characters",
    "string.max": "Content must be at most 250 characters",
    "any.required": "Content is required",
  }),
  image: j.allow(null),
});
