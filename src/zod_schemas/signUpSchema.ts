import {z} from 'zod';

export const SignUpSchema = z.object({
    username:z.string().min(6,"Username must be atleast six character"),
    password:z.string().min(6,"Password must be atleast six character"),
    email:z.string().email({message:"Invalid email address"}).optional()
})