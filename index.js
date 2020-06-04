const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

//storage
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image-file");

//
function checkFileType(file, cb) {
  //allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only");
  }
}

//init logger

const logger = require("./middleware/logger");
const app = express();

//Init middleware
//app.use(logger);

//ejs
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "error: no file selected",
        });
      } else {
        res.render("index", {
          msg: "file uploaded",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

//member api router
app.use("/api/members", require("./routes/api/members"));

app.use("/api/practice", require("./routes/api/practice"));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://jomopel:jomopel@lsk-express-i2cou.mongodb.net/<dbname>?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    );
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();
