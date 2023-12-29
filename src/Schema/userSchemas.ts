// userSchemas.js

import { z } from 'zod';

const registrationSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export { registrationSchema,loginSchema };
