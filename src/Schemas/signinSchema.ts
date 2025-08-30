import {z} from 'zod'

export const signinSchema = z.object(
    {
        email: z.string().regex(/^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/),
        password: z.string()
    }
)