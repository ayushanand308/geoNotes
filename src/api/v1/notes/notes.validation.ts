import { z } from "zod";

export const noteValidation = z.object({
    latitude: z.number(),
    longitude: z.number(),
    message: z.string(),
})

