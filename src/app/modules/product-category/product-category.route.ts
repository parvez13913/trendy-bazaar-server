import express from "express";
import { ProductCategoryController } from "./product-category.controller";

const router = express.Router();

router.post(
  "/create-product-category",
  ProductCategoryController.createProductCategory
);

export const ProductCategoryRoutes = router;
