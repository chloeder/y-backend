export type CreateThreadDto = {
  content: string;
  image?: string;
};

export type UpdateThreadDto = Partial<CreateThreadDto>;
