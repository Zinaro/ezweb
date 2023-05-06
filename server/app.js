const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./db");
const User = require("./userModel.js");
const Post = require("./post.js");
const Category = require("./category.js")
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const categoriesRouter = require('./routes/categories');
const upload = multer({ dest: 'uploads/' });

db.connect();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', usersRouter);
app.use('/', postsRouter);
app.use('/', categoriesRouter);



app.post('/upload/:id', (req, res) => {
  const userId = req.params.id;
  const uploadDir = path.join(__dirname, `../client/src/assets/images/${userId}`);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = userId;
      const filename = name + ext;
      if (fs.existsSync(path.join(uploadDir, filename))) {
        let i = 1;
        while (fs.existsSync(path.join(uploadDir, `${name}-${i}${ext}`))) {
          i++;
        }
        cb(null, `${name}-${i}${ext}`);
      } else {
        cb(null, filename);
      }
    }
  });
  const upload = multer({ storage: storage }).single('image');
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'An error occurred while uploading the image.' });
    }
    const imageUrl = req.file.filename;
    res.json({ imageUrl: imageUrl });
  });
});







//CKEditor
app.post('/image/upload', upload.single('image'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please select an image file!');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file); 
});



app.listen(3000, () => {
  console.log("Server starting: http://localhost:3000");
});
