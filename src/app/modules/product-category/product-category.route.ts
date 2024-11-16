import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductCategoryValidation } from "./product-category-validation";
import { ProductCategoryController } from "./product-category.controller";

const router = express.Router();

router.get("/:id", ProductCategoryController.getSingleProductCategory);

router.post(
  "/create-product-category",
  validateRequest(ProductCategoryValidation.createZodSchema),
  ProductCategoryController.createProductCategory
);

router.patch("/:id", ProductCategoryController.updateProductCategory);

router.delete("/:id", ProductCategoryController.deleteProductCategory);

export const ProductCategoryRoutes = router;
