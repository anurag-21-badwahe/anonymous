import { z } from 'zod';

export const passwordSchema = z.object({
    newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});