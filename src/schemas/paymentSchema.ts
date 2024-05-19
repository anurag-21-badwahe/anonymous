import { z } from "zod";






export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

// Define the payment schema
export const paymentSchema = z.object({
  name: usernameValidation,
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(300, { message: "Message must not be longer than 300 characters." }),
    payment: z
    .number()
    .positive()
    .refine((val) => val > 10, { message: "Amount must be greater than 10" }),
});

