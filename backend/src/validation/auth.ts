import { z } from 'zod';

export const registerSchema = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6), role: z.enum(['BUYER','SELLER','ADMIN']).optional() });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
