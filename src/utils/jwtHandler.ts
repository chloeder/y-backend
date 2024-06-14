import jwt from "jsonwebtoken";
type Payload = {
  id: string;
  username: string;
  email: string;
  fullName: string;
};

export const generateToken = (payload: Payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return token;
};

export const generateRefreshToken = (payload: Payload) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
  return refreshToken;
};

export const verifyToken = (token: string): Payload => {
  return jwt.verify(token, process.env.JWT_SECRET! as string) as Payload;
};
