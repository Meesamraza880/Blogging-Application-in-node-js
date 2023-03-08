const mongoose = require("mongoose");

const roleCollection = new mongoose.Schema({
  role_id: { type: Number, require: true, trim: true },
  role: { type: String, require: true, trim: true },
});

const userCollection = new mongoose.Schema({
  role_id: { type: Number, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  email: { type: String, require: true, trim: true },
  password: { type: String, require: true, trim: true },
});

const UserModel = mongoose.model("user", userCollection);
const RoleModel = mongoose.model("role", roleCollection);

module.exports = {
  UserModel,
  RoleModel,
};
