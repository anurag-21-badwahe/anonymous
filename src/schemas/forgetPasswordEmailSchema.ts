import { z } from 'zod';

export const verifyEmailSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});