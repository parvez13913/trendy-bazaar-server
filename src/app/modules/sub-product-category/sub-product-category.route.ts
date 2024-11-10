import express from "express";
import { SubProductCategoryController } from "./sub-product-category.controller";

const router = express.Router();

router.get("/:id", SubProductCategoryController.getSingleSubProductCategory);

router.post(
  "/create-sub-product-category",
  SubProductCategoryController.createSubProductCategory
);

router.patch("/:id", SubProductCategoryController.updateSubProductCategory);

router.delete("/:id", SubProductCategoryController.deleteSubProductCategory);

export const SubProductCategoryRoutes = router;
