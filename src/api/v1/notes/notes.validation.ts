import { z } from "zod";

export const noteSchema = z.object({
    latitude: z.number()
        .min(-90, "Latitude must be between -90 and 90 degrees")
        .max(90, "Latitude must be between -90 and 90 degrees"),
    longitude: z.number()
        .min(-180, "Longitude must be between -180 and 180 degrees")
        .max(180, "Longitude must be between -180 and 180 degrees"),
    message: z.string().max(280, "Message must be 280 characters or less"),
})

export const notesWithinSchema = z.object({
    latitude: z.number()
        .min(-90, "Latitude must be between -90 and 90 degrees")
        .max(90, "Latitude must be between -90 and 90 degrees"),
    longitude: z.number()
        .min(-180, "Longitude must be between -180 and 180 degrees")
        .max(180, "Longitude must be between -180 and 180 degrees"),
    radius: z.number()
        .min(0, "Radius must be greater than 0")
        .max(1000, "Radius must be less than 1000")
})
