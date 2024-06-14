export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  photoProfile?: string;
  bio?: string;
};
