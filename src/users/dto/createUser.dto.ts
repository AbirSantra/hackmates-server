import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
