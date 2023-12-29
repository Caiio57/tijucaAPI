import { Router } from "express";
import { createAccess, getAllAccesses } from "./controller/AccessController";
import { signIn } from "./controller/SessãoController";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getUniqueUser,
} from "./controller/UserController";
import { createSubCategory } from "./controller/SubCategoryController";
import { createCategory } from "./controller/CategoryController";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "./controller/ProductController";
import { createSale } from "./controller/SaleController";
import { findProductbyCategory } from "./controller/FindProductsByCategoryController";
// import { generateSalesReport } from "./controller/RelatorioController"
import { findProduct } from "./controller/FindProductsController";
import { addToWishList, removeFromWishList } from "./controller/WishListController";
import { deleteRateProduct, getAllRates, rateProduct } from "./controller/RatingController";
import { displaySalesReport } from "./controller/SalesReportController";
import uploadsConfig from './config/multer'
import multer from "multer"


import { verificarAutenticacao } from "./middleware/authMiddleware";

export const router = Router();
const upload = multer(uploadsConfig)

router.get('/', (req, res) => {
  res.send('oi bianca')
})
/**
 * Rotas do usuário
 */
router.post("/user", createUser);
router.delete("/delete-users", verificarAutenticacao(["Admin"]), deleteManyUser);
router.get("/get-all-users", verificarAutenticacao(["Admin"]), getAllUser);
router.get(
  "/get-unique-user",
  verificarAutenticacao(["Admin", "Vendedor", "Comprador"]),
  getUniqueUser,
);

/**
 * Rotas de acessos\
 */
router.post("/access", verificarAutenticacao(["Admin"]), createAccess);
router.get("/accesses", verificarAutenticacao(["Admin", "Vendedor"]), getAllAccesses);

/**
 * Rotas de autenticação
 */
router.post("/Login", signIn);

// Rotas de Categorias

router.post("/category", verificarAutenticacao(["Admin"]), createCategory)
router.post("/subcategory", verificarAutenticacao(["Admin"]), createSubCategory)

// Rotas de Produtos

router.post("/cadastro", upload.array("images"), verificarAutenticacao(["Admin", "Vendedor"]), createProduct)
router.get("/allproducts", verificarAutenticacao(["Admin", "Vendedor"]), getAllProducts)
router.put("/updateproduct/:productId/:category/:subcategory", verificarAutenticacao(["Admin", "Vendedor"]), updateProduct)
router.delete("/deleteproduct/:productId", verificarAutenticacao(["Admin", "Vendedor"]), deleteProduct)

// Rotas de Vendas

router.post("/createsale", verificarAutenticacao(["Admin", "Vendedor"]), createSale)

// Rota de Busca

router.get("/filter", verificarAutenticacao(["Admin", "Vendedor"]) , findProductbyCategory)
// router.get("/filter",verificarAutenticacao, findProduct)

// Rota Lista de Desejos

router.post("/wishlist", verificarAutenticacao(["Comprador"]), addToWishList)
router.delete("/deletewish/:productid/:userId", verificarAutenticacao(["Comprador"]), removeFromWishList)

// Rota de Classificação

router.post("/rating/:userId", verificarAutenticacao(["Comprador"]), rateProduct)
router.delete("/rating/:id", verificarAutenticacao(["Comprador"]), deleteRateProduct)
router.get("/allrates", verificarAutenticacao(["Comprador"]), getAllRates)

// Rota de relatório

// router.get("/relatorio-teste", generateSalesReport)
router.get("/sales-report", verificarAutenticacao(["Admin", "Vendedor"]), displaySalesReport);