import { z } from "zod";

const registerZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: "First name is required" }),
    middleName: z.string().optional(),
    lastName: z.string({ required_error: "Last name is required" }),
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }),
    role: z.string({ required_error: "Role is required" }),
    contactNo: z.string().optional(),
    gender: z.string({ required_error: "Gender is required" }),
    bloodGroup: z.string().optional(),
    dateBirth: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const AuthValidation = {
  registerZodSchema,
};
