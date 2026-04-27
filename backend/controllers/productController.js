const Product=require("../models/Products");
const User=require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.addProduct=async (req,res)=>{
    try{
       const{name,description,price,stock,category,isFeatured}=req.body;
        if(!name || !description || !price || !stock || !category || !req.file){
            return res.status(400).json({message:"Please provide all required fields and an image file"});
        }
        
        // Upload image to cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const image = result.secure_url;
       
        const shopkeeper = await User.findById(req.user.id);
        const shopName = shopkeeper ? shopkeeper.shopName : "Unknown Shop";

        const shopkeeperId = req.user.id;

        const product=await Product.create({
            name,description,price,stock,image,category,
            isFeatured: isFeatured || "false",
            shopName,
            shopkeeperId
        });
        res.status(201).json({message:"Product created successfully",product});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // product id from URL

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID from URL
    const updates = req.body;  // Fields to update (name, price, stock, etc.)

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,            // return the updated product
      runValidators: true   // ensure schema validation applies
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Case-insensitive search using regex
    const products = await Product.find({
      category: { $regex: `^${categoryName}$`, $options: "i" } 
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyShopProducts = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;
    const products = await Product.find({ shopkeeperId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
