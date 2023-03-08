const mongoose = require("mongoose");

const postCollection = new mongoose.Schema({
  role_id: { type: Number, require: true, trim: true },
  add_by: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  ImagePath: { type: String, require: true, trim: true },
  Desscription: { type: String, require: true, trim: true },
  Is_approved: { type: Boolean, require: true },
});

const postModel = mongoose.model("Blog_post", postCollection);
module.exports = {
  postModel,
};
