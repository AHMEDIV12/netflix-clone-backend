const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, req: true, unique: true },
    email: { type: String, req: true, unique: true },
    password: { type: String, req: true },
    profilePicture: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema)
