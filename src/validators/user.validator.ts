import j from "joi";

export const updateProfileSchema = j.object({
  fullName: j.allow(null),
  username: j.allow(null),
  bio: j.allow(null),
  photoProfile: j.allow(null),
  coverImage: j.allow(null),
  realName: j.allow(null),
  bornDate: j.allow(null),
  address: j.allow(null),
});
