import express from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductCategoryRoutes } from "../modules/product-category/product-category.route";
import { SubProductCategoryRoutes } from "../modules/sub-product-category/sub-product-category.route";
import { UserRoutes } from "../modules/users/users.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/categories",
    route: ProductCategoryRoutes,
  },
  {
    path: "/sub-categories",
    route: SubProductCategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
