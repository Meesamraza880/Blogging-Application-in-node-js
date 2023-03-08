const express = require("express");

const {
  HomeIndex,
  signup,
  signin,
  forget,
  userRegistration,
  userLogin,
  RegisterAdmin,
  dashboard,
  logout,
  userForget,
  usernewpass,
} = require("../controllers/HomeController");

const {
  add_post,
  delete_post,
  update_post,
} = require("../controllers/PostController.js");

const route = express.Router();

route.get("/", HomeIndex);
route.get("/seeder", RegisterAdmin);
route.get("/signup", signup);
route.get("/signin", signin);
route.get("/forget", forget);
route.post("/new_pass", usernewpass);
route.post("/forget_pass", userForget);
route.get("/logout", logout);
route.get("/admin", dashboard);
route.post("/register", userRegistration);
route.post("/login", userLogin);
route.post("/addPost", add_post);
route.get("/deletePost/:id", delete_post);
route.post("/updatePost", update_post);

module.exports = {
  routes: route,
};
