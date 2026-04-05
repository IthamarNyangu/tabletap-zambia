import { z } from "zod";

export const loginEmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const loginPasswordSchema = z
  .string()
  .min(1, "Password is required.")
  .max(128, "Password is too long.");

export const loginNextPathSchema = z
  .string()
  .trim()
  .regex(/^\/(?!\/).*/, "Redirect path is invalid.")
  .optional();

export const loginSchema = z.object({
  email: loginEmailSchema,
  password: loginPasswordSchema,
  next: loginNextPathSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
