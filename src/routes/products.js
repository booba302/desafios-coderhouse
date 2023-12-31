import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
import ProductModel from "../dao/models/products.schema.js";

const productMng = new ProductManager();
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    let order, filter;
    !query ? (filter = {}) : (filter = { category: query });
    sort == "asc" ? (order = 1) : sort == "desc" ? (order = -1) : (order = 0);
    const products = await ProductModel.paginate(filter, {
      limit: limit,
      page: page,
      sort: { price: order },
      lean: true,
    });
    res.send(products);
  } catch (error) {
    res.status(404).send({ error: true });
  }
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productMng.getProductById(id);
    res.send(product);
  } catch (error) {
    error.message === "Product Not found"
      ? res.status(404).send({ msg: "El ID del producto es inválido" })
      : res.status(500);
  }
});

productRouter.post("/", async (req, res) => {
  const body = req.body;
  try {
    const newProduct = await productMng.addProduct(body);
    res.send({
      sucess: true,
      msg: "El siguiente producto fue creado satisfactoriamente",
      product: newProduct,
    });
  } catch (error) {
    error.message === "Missing data"
      ? res.status(400).send({ msg: "Datos faltantes" })
      : res.status(500);
    error.message === "Already exist"
      ? res.status(400).send({ msg: "Ya existe un producto con ese código" })
      : res.status(500);
  }
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const updProduct = await productMng.updateProduct(id, body);
    res.send({
      sucess: true,
      msg: "El siguiente producto fue actualizado satisfactoriamente",
      product: updProduct,
    });
  } catch (error) {
    error.message === "Not found"
      ? res.status(404).send({ msg: "El ID es inválido" })
      : res.status(500);
  }
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const delProduct = await productMng.deleteProduct(id);
    res.send({
      sucess: true,
      msg: "El siguiente producto fue eliminado satisfactoriamente",
      product: delProduct,
    });
  } catch (error) {
    error.message === "Not found"
      ? res.status(404).send({ msg: "El ID es inválido" })
      : res.status(500);
  }
});

export default productRouter;
