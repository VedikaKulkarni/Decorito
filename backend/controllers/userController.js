const User=require("../models/User");
require('dotenv').config();
const cloudinary = require("../config/cloudinary");

const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, shopName } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" }); // ✅ use 400, not 201
    }

    // hash password
    const hashP = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashP,
      role: role || "user",
      shopName: role === 'shopkeeper' ? shopName : undefined
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.login=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"No User found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"});
        }

        const token=jwt.sign({id:user._id,email:user.email, role: user.role},process.env.JWT_SECRET,{ expiresIn: "1d" });
        res.status(200).json({message:"login successfull",token, role: user.role});

    }
    catch(err){
        res.status(500).json(err.message);
    }
}


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update normal fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // Prevent "undefined" string bugs from existing payloads
    if (req.body.phone !== undefined && req.body.phone !== "undefined") {
      user.phone = req.body.phone;
    }
    if (req.body.address !== undefined && req.body.address !== "undefined") {
      user.address = req.body.address;
    }

    // If file uploaded, send it to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer); // no streamifier needed!
      });

      user.image = result.secure_url;
    }

    // Save updated user
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
