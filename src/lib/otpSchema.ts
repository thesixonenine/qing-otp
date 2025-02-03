import { z } from 'zod'

export const OTPSchema = z.object({
    secret: z.string().min(10),
    name: z.string().min(1)
})
