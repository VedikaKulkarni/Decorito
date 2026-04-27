const express=require("express");
const {register,login,getUserProfile,updateUserProfile}=require("../controllers/userController");
const auth=require("../middleware/auth");
const upload = require("../middleware/uploads");
const router=express.Router();

router.post("/register",register);

router.post("/login",login);

router.get("/getprofile",auth,getUserProfile);

router.put("/updateprofile", auth, upload.single("image"), updateUserProfile);


module.exports=router;