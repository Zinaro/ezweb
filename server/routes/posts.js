const express = require("express");
const Post = require("../post.js");
const router = express.Router();

// POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().maxTimeMS(10000);
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    await post.save();
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("hi zinar, you have an error");
  }
});

router.delete("/:id", async (req, res) => {
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

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().maxTimeMS(10000);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "hi zinar, server error" });
  }
});

router.get("/posts/:id/user", async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ postAutorId: userId });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/posts/unapproved", async (req, res) => {
  try {
    const posts = await Post.find({ postApproved: false });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "hi zinar, server error" });
  }
});
router.get("/posts/approved", async (req, res) => {
  try {
    const posts = await Post.find({ postApproved: true });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "hi zinar, server error" });
  }
});
router.delete("/posts/:id", async (req, res) => {
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
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "hi zinar, server error" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const post = req.body;
    let newPost = null;
    let postUrl = post.postUrl;

    const existingPost = await Post.findOne({ postUrl });
    if (existingPost) {
      const randomString = Math.random().toString(36).substring(2, 8);
      postUrl = `${postUrl}-${randomString}`;
    }

    newPost = await Post.create({ ...post, postUrl });
    await newPost.save().then(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "hi zinar, you have an error" });
  }
});

router.put("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/posts/:id/like", async (req, res) => {
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

router.delete("/posts/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const like = post.likes.find((like) => like.likeId.toString() === userId);
    if (!like) {
      return res
        .status(400)
        .json({ message: "The post has not already been liked" });
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
router.get("/users/:userId/posts/favorites", async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Post.find({ "likes.likeId": userId }).populate(
      "postAutorId"
    );
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});




// COMMENTS
router.post('/comment/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { commentContent, commentAuthorId } = req.body;
    const commentData = {
      commentContent,
      commentAuthorId,
      commentDate: new Date().toLocaleString("tr-TR")
    };
    const post = await Post.findById(postId);
    post.postComments.push(commentData);
    await post.save();
    res.status(201).json({ message: 'Created comment', comment: commentData });
  } catch (error) {
    res.status(500).json({ message: 'hi zinar, you have an error', error: error.message });
  }
});
router.delete('/comment/:postId/:commentId', async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Gönderi bulunamadı' });
    }
    const commentIndex = post.postComments.findIndex(comment => comment._id == commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    post.postComments.splice(commentIndex, 1);
    await post.save();
    res.json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});



module.exports = router;
