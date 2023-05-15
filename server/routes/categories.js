const express = require('express');
const Category = require("../category.js")
const Post = require("../post.js")
const router = express.Router();


// CATEGORY
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("posts");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "hi zinar, you have an error" });
  }
});

router.post("/category", async (req, res) => {
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
router.put("/category/:id/addpost", async (req, res) => {
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

router.put("/category/:id/", async (req, res) => {
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

router.delete("/category/:id/", async (req, res) => {
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



router.get("/category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    let category = null;
    let posts = [];

    if (categoryId) {
      category = await Category.findById(categoryId);
      console.log(category);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      posts = await Post.find({ postCategory: categoryId });
    } else {
      posts = await Post.find();
    }
    res.json({ category, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});





module.exports = router;