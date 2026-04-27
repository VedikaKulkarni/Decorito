const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

async function fixUndefinedUsers() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const resPhone = await User.updateMany(
     { phone: "undefined" },
     { $set: { phone: "" } }
  );

  const resAddress = await User.updateMany(
     { address: "undefined" },
     { $set: { address: "" } }
  );

  console.log("Fixed phones:", resPhone.modifiedCount);
  console.log("Fixed addresses:", resAddress.modifiedCount);
  process.exit(0);
}

fixUndefinedUsers();
