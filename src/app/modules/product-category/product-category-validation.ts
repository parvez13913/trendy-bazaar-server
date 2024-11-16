import { z } from "zod";

const createZodSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const ProductCategoryValidation = {
  createZodSchema,
};
