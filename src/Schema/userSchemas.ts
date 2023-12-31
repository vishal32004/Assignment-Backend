// userSchemas.js

import { z } from 'zod';

const registrationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const updateSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    // password: z.string()
})

type updateType = z.infer<typeof updateSchema>
  



export { registrationSchema,loginSchema,updateSchema,updateType };
