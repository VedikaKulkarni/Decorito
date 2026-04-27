const mongoose=require("mongoose");
const productSchema=new mongoose.Schema(
   {
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    stock:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
    shopName:{type:String},
    shopkeeperId:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    isFeatured:{type:String,required:true},
    createdAt:{type:String},
    updatedAt:{type:String}
   },
   {timestamps:true}
);

module.exports=mongoose.model("Products",productSchema);