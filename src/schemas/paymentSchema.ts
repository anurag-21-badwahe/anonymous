import { z, ZodTypeAny } from "zod";

export const numericString = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === "string") {
      return parseInt(a, 10);
    } else if (typeof a === "number") {
      return a;
    } else {
      return undefined;
    }
  }, schema);

const FindMany = z.object({
  take: numericString(z.number()),
});

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
  payment:numericString(z.number().positive())
});
