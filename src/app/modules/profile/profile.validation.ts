import { z } from "zod";

const profileZodSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  contactNo: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
});

export const ProfileValidation = {
  profileZodSchema,
};
