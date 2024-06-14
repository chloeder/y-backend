import bcrypt from "bcrypt";

// Hashing password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Compare password
export const comparePassword = async (
  dbPassword: string,
  inputPassword: string
) => {
  return await bcrypt.compare(inputPassword, dbPassword);
};
