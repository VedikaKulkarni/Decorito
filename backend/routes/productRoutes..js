const express=require("express");
const{addProduct,getProductsByCategory,getProductById, deleteProduct, updateProduct, getMyShopProducts}=require("../controllers/productController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploads");

const router=express.Router();

router.post("/addproduct", auth, authorizeRoles("admin", "shopkeeper"), upload.single("image"), addProduct);

router.delete("/deleteproduct/:id", auth, authorizeRoles("admin", "shopkeeper"), deleteProduct);

router.put("/updateproduct/:id", auth, authorizeRoles("admin", "shopkeeper"), updateProduct);

router.get("/getproduct/:id",getProductById);
router.get("/getproductsbycategory/:categoryName",getProductsByCategory);

router.get("/myshop-products", auth, authorizeRoles("shopkeeper", "admin"), getMyShopProducts);

module.exports=router;
