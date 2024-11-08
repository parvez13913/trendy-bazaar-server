import express from "express";
import { ProductCategoryController } from "./product-category.controller";

const router = express.Router();

router.get("/:id", ProductCategoryController.getSingleProductCategory);

router.post(
  "/create-product-category",
  ProductCategoryController.createProductCategory
);

router.patch("/:id", ProductCategoryController.updateProductCategory);

router.delete("/:id", ProductCategoryController.deleteProductCategory);

export const ProductCategoryRoutes = router;
