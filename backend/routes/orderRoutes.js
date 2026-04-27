const express=require("express");
const{saveAddress,getSavedAddresses,placeOrder,getOrderById,getOrdersByUser,getShopkeeperOrders,createPaymentIntent}=require("../controllers/orderController")
const auth=require("../middleware/auth");

const router=express.Router();

router.post("/saveaddress",auth,saveAddress);
router.get("/getaddress",auth,getSavedAddresses);
router.post("/order",auth,placeOrder);
router.get("/my-orders", auth, getOrdersByUser);
router.get("/order/:id",getOrderById);
router.get("/myshop-orders", auth, getShopkeeperOrders);
router.post("/create-payment-intent", auth, createPaymentIntent);
router.put("/order/:id/status", auth, require("../controllers/orderController").updateOrderStatus);

module.exports=router;
