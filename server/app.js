const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./db");
const User = require("./userModel.js");
const Post = require("./post.js");
const Category = require("./category.js")


db.connect();
console.log(db);
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().maxTimeMS(10000);
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});

app.post("/", async (req, res) => {
  try {
    const post = req.body;
    const newPost = await Post.create(post);
    await newPost.save().then(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "hi zinar, you have an error" });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    await post.save();
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).send("hi zinar, document not found");
    }
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});



















// USER
app.get("/users", async (req, res) => {
  try {
    const items = await User.find().maxTimeMS(10000);
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).maxTimeMS(10000);
    if (!user) {
      return res.status(404).send("hi zinar, user not found");
    }
    console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const newUser = await User.create(user);
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "hi zinar, you have an error" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.name = req.body.name || user.name;
    user.mail = req.body.mail || user.mail;
    user.password = req.body.password || user.password;
    user.profileImage = req.body.profileImage;
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.put("/users/:id/root", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.mail = req.body.mail || user.mail;
    user.permission = req.body.permission || user.permission;
    user.password = req.body.password || user.password;
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
    }
    if (req.body.mail && req.body.mail !== user.mail) {
      const existingUser = await User.findOne({ mail: req.body.mail });
      if (existingUser) {
        return res.status(400).send("E-mail already exists");
      }
    }
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.delete("/users/:id/root", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      res.status(404).send("hi zinar, user not found");
    }
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("hi zinar, you have an error");
  }
});

// FOLLOW
app.put("/users/:id/followers", async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId, userId } = req.body;
    console.log(followerId, userId);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "hi zinar, user not found" });
    }

    const follower = user.followers.find((f) => f.followerId === followerId);
    if (!follower) {
      user.followers.push({ followerId, userId });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "hi zinar, you have an error" });
  }
});

app.put("/users/:id/following", async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId, userId } = req.body;
    console.log(followerId, userId);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "hi zinar, user not found" });
    }

    const follower = user.following.find((f) => f.followerId === followerId);
    if (!follower) {
      user.following.push({ followerId, userId });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "hi zinar, you have an error" });
  }
});

app.delete("/users/:id/followers", async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId, userId } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "hi zinar, user not found" });
    }

    const followerIndex = user.followers.findIndex(
      (f) => f.followerId === followerId
    );
    if (followerIndex !== -1) {
      user.followers.splice(followerIndex, 1);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "hi zinar, you have an error" });
  }
});

app.delete("/users/:id/following", async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId, userId } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "hi zinar, user not found" });
    }

    const followerIndex = user.following.findIndex(
      (f) => f.followerId === followerId
    );
    if (followerIndex !== -1) {
      user.following.splice(followerIndex, 1);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "hi zinar, you have an error" });
  }
});
app.get("/users/:id/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following.followerId"
    );
    res.json(user.following.map((item) => item.followerId));
  } catch (error) {
    console.log(error);
    res.status(500).send("hi zinar, server error");
  }
});
app.get("/users/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers.followerId"
    );
    res.json(user.followers.map((item) => item.followerId));
  } catch (error) {
    console.log(error);
    res.status(500).send("hi zinar, server error");
  }
});




















// POSTS
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().maxTimeMS(10000);
    res.json(posts);
  } catch (error) {
    console.log(error);
    console.log(``)
    res.status(500).json({ message: "hi zinar, server error" });
  }
});
app.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "hi zinar, server error" });
  }
});

app.put("/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.body.userId;
    const postId = req.body.postttId;
    if (!userId || !postId) {
      return res
        .status(400)
        .json({ message: "User ID and Post ID are required" });
    }
    const alreadyLiked = post.likes.some((l) => l.likeId == userId);
    if (alreadyLiked) {
      return res.status(400).json({ message: "Post already liked" });
    } else {
      post.likes.push({ likeId: userId, postId: postId });
      await post.save();
      res.json(post);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/posts/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const like = post.likes.find((like) => like.likeId.toString() === userId);
    if (!like) {
      return res.status(400).json({ message: "The post has not already been liked" });
    }
    const index = post.likes.indexOf(like);
    post.likes.splice(index, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/users/:userId/posts/favorites", async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Post.find({ "likes.likeId": userId }).populate("postAutorId");
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});









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











// CATEGORY
app.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("posts");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "hi zinar, you have an error" });
  }
});

app.post("/category", async (req, res) => {
  try {
    const category = req.body;
    const newCategory = await Category.create(category);
    await newCategory.save().then(newCategory);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "hi zinar, you have an error" });
  }
});
app.put("/category/:id/addpost", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const postId = req.body.postId;
    const category = await Category.findById(categoryId);
    category.posts.push(postId);
    await category.save();
    res.status(200).send("Post added to category successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding post to category");
  }
});

app.put("/category/:id/", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: req.body.name },
      { new: true }
    ).populate("posts");
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/category/:id/", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.status(200).send("Category deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting category");
  }
});






app.listen(3000, () => {
  console.log("Server starting: http://localhost:3000");
});
