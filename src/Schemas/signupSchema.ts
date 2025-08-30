import {z} from 'zod'

export const UsernameVerification = z.object({
    username : z.string().min(4,"username cant be less then 4 ").max(17,"username cant be more than 1 char")
})
export const signupSchema = z.object(
    {
        username : z.string(),
        email : z.string().regex(/^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/),
        password : z.string()

    }
)
