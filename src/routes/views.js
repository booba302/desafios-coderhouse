import { Router } from "express";
import ProductManager from "../productManager.js";

const productMng = new ProductManager();

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const products = await productMng.getProducts();
  res.render("home", { products });
});

export default viewsRouter;