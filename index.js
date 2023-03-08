const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/bloggingAppDB",
  collection: "sessions",
});
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
// const upload = multer();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const connectDB = require("./config/dbconnection");

const HomeRoutes = require("./routes/HomeRoutes.js");
const bodyParser = require("body-parser");

//This  is a middleware function in an Express.js application that serves static files from the "public" directory
app.use(express.static(path.join(__dirname, "public/")));
app.use(
  session({
    secret: "mycrentailssecretkey",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());
const Post = process.env.PORT;
const db_URL = process.env.db_URL;
connectDB(db_URL);

app.use(express.json());
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(upload.single("image"));
app.use(HomeRoutes.routes);

app.listen(Post, () => console.log("blogging Application"));
