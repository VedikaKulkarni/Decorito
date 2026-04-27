const express=require("express");
const router=express.Router();
const {addToCart,getCart,removeFromCart} =require("../controllers/cartController")
const auth=require("../middleware/auth");

router.post("/addtocart",auth,addToCart);

router.get("/getcart",auth,getCart);

router.post("/removecart",auth,removeFromCart);

module.exports=router;
