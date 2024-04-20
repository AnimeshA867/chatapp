import * as z from 'zod'

export const addFriendValidator = z.object({
  email: z.string().email(),
});
