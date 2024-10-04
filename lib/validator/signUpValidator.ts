import { z } from "zod";

export const signUpValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
