const { postModel } = require("../models/postModule.js");
const jsonwebtoken = require("jsonwebtoken");

const add_post = async (req, res) => {
  const decodedToken = jsonwebtoken.verify(
    req.session.user.token,
    process.env.JWT_KEY
  );
  const user_id = decodedToken.user_id;

  const data = await postModel.create({
    role_id: req.session.user.role_id,
    add_by: user_id,
    title: req.body.title,
    ImagePath: req.file.destination + req.file.filename,
    Desscription: req.body.description,
    Is_approved: false,
  });
  req.flash("success", "POST added");
  res.redirect("/admin");
};

const update_post = async (req, res) => {
  if (req.session.user.role_id == 1) {
    if (req.file != undefined) {
      try {
        const update = await postModel.updateOne(
          { _id: req.body._id },
          {
            title: req.body.title,
            ImagePath: req.file.destination + req.file.filename,
            Desscription: req.body.Description,
            Is_approved: req.body.Is_approved,
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const update = await postModel.updateOne(
          { _id: req.body._id },
          {
            title: req.body.title,
            Desscription: req.body.Description,
            Is_approved: req.body.Is_approved,
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    req.flash("success", "POST updated");
    res.redirect("/admin");
  } else {
    if (req.file != undefined) {
      try {
        const update = await postModel.updateOne(
          { _id: req.body._id },
          {
            title: req.body.title,
            ImagePath: req.file.destination + req.file.filename,
            Desscription: req.body.Description,
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const update = await postModel.updateOne(
          { _id: req.body._id },
          {
            title: req.body.title,
            Desscription: req.body.Description,
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    req.flash("success", "POST updated");
    res.redirect("/admin");
  }
};

const delete_post = async (req, res) => {
  const postId = req.params.id;
  try {
    await postModel.deleteOne({ _id: postId });
    req.flash("success", "POST deleted");
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  add_post,
  delete_post,
  update_post,
};
