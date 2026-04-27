const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, required: true, unique: true, },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["user", "admin", "shopkeeper"],
            default: "user",
        },
        phone: {
            type: String,

        },
        image: {
            type: String,
            default: "https://via.placeholder.com/150", // default profile image
        },

        address: { type: String, trim: true },
        shopName: { type: String, trim: true }

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);