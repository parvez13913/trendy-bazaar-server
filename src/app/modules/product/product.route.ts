import express from "express";
import { ProductController } from "./product.controller";

const router = express.Router();

router.get("/:id", ProductController.getSingleProduct);

router.post("/create-product", ProductController.createProduct);

router.delete("/:id", ProductController.deleteProduct);

export const ProductRoutes = router;
