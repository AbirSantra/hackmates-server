import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .min(1, { message: 'Password is required' }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
