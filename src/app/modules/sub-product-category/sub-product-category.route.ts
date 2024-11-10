import express from "express";
import { SubProductCategoryController } from "./sub-product-category.controller";

const router = express.Router();

router.get(
  "/create-sub-product-category",
  SubProductCategoryController.getSingleSubProductCategory
);
router.post(
  "/create-sub-product-category",
  SubProductCategoryController.createSubProductCategory
);

export const SubProductCategoryRoutes = router;
