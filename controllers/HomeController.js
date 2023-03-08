const { UserModel, RoleModel } = require("../models/userModule.js");
const { postModel } = require("../models/postModule.js");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const HomeIndex = async (req, res) => {
  const errors = req.flash("error") || [];
  const successMessages = req.flash("success") || [];
  try {
    const data = await postModel.find({ Is_approved: "true" });
    const authorData = await UserModel.find();
    const newData = data.map((d) => {
      const aa = authorData.find((a) => d.add_by == a._id);
      const name = { post_added: aa.name };
      return { ...d, ...name };
    });
    res.render("home", { newData, errors, successMessages });
  } catch (error) {
    console.error(error);
    req.flash("error", "Unable to load posts");
    res.render("home", { errors, successMessages });
  }
};

const signup = (req, res) => {
  const errors = req.flash("error") || [];
  const successMessages = req.flash("success") || [];
  res.render("signup", { errors, successMessages });
};
const signin = (req, res) => {
  const errors = req.flash("error") || [];
  const successMessages = req.flash("success") || [];
  res.render("signin", { errors, successMessages });
};

const forget = (req, res) => {
  const errors = req.flash("error") || [];
  const successMessages = req.flash("success") || [];
  res.render("forget", { errors, successMessages });
};

const dashboard = async (req, res) => {
  const errors = req.flash("error") || [];
  const successMessages = req.flash("success") || [];
  try {
    if (req.session.user.role_id == 1) {
      const role_id = req.session.user.role_id;
      const data = await postModel.find();
      const authorData = await UserModel.find();

      const newData = data.map((d) => {
        const aa = authorData.find((a) => d.add_by == a._id);
        const name = { post_added: aa.name };
        return { ...d, ...name };
      });

      res.render("admin", { newData, errors, successMessages, role_id });
    } else {
      const decodedToken = jsonwebtoken.verify(
        req.session.user.token,
        process.env.JWT_KEY
      );
      const user_id = decodedToken.user_id;
      const data = await postModel.find({ add_by: user_id });
      const role_id = req.session.user.role_id;
      res.render("admin", { data, errors, successMessages, role_id });
    }
  } catch (error) {
    console.error(error);
  }
};

const RegisterAdmin = async (req, res) => {
  const name = "Super Admin";
  const email = "admin@admin.com";
  const password = "admin12345";

  const user = await UserModel.findOne({ email: email });
  if (user) {
    req.flash("error", "Super Admin Credentials already exist");
    res.redirect("/");
  } else {
    try {
      const salt = await bcrypt.genSalt(12);
      const hashpassword = await bcrypt.hash(password, salt);

      const roleData = await RoleModel.create([
        {
          role_id: 1,
          role: "Super Admin",
        },
        {
          role_id: 2,
          role: "Author",
        },
        {
          role_id: 3,
          role: "User",
        },
      ]);

      const data = await UserModel.create({
        role_id: 1,
        name: name,
        email: email,
        password: hashpassword,
      });
      req.flash("success", "Super Admin Sucessfully register");
      res.redirect("/");
    } catch (error) {
      console.log(error);
      req.flash("error", "Unable to register");
      res.redirect("/");
    }
  }
};

const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      req.flash("error", "Email already exist please choose another one");
      res.redirect("/signup");
    } else {
      try {
        const salt = await bcrypt.genSalt(12);
        const hashpassword = await bcrypt.hash(password, salt);
        const data = await UserModel.create({
          role_id: 2,
          name: name,
          email: email,
          password: hashpassword,
        });
        req.flash("success", "Register Successfully");
        res.redirect("/signup");
      } catch (error) {
        console.log(error);
        req.flash("error", "Unable to Register");
        res.redirect("/signup");
      }
    }
  } else {
    req.flash("error", "All fields are required");
    res.redirect("/signup");
  }
};

const userForget = async (req, res) => {
  const { email } = req.body;

  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.render("new_password", { email });
    } else {
      req.flash("error", "Email does not exist please choose correct one");
      res.redirect("/forget");
    }
  } else {
    req.flash("error", "All fields are required");
    res.redirect("/forget");
  }
};

const usernewpass = async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(password, salt);
    const data = await UserModel.updateOne(
      { email: email },
      { password: hashpassword }
    );
    req.flash("success", "password updated Successfully");
    res.redirect("/forget");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to update password");
    res.redirect("/forget");
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await UserModel.findOne({ email: email });
    if (user != null) {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const JWT_KEY = "hhfdstwvxshshdshd";
          const token = jsonwebtoken.sign(
            { user_id: user._id },
            process.env.JWT_KEY,
            {
              expiresIn: "5d",
            }
          );

          req.session.user = {
            role_id: user.role_id,
            token: token,
          };
          res.redirect("/admin");
        } else {
          req.flash("error", "Password Not Match");
          res.redirect("/signin");
        }
      } catch (error) {
        console.log(error);
        req.flash("error", "Unable to login");
        res.redirect("/signin");
      }
    } else {
      req.flash("error", "This Email not exist");
      res.redirect("/signin");
    }
  } else {
    req.flash("error", "All fields are required");
    res.redirect("/signin");
  }
};

const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/signin");
    }
  });
};

module.exports = {
  HomeIndex,
  signup,
  signin,
  forget,
  userRegistration,
  userLogin,
  userForget,
  RegisterAdmin,
  dashboard,
  logout,
  usernewpass,
};
