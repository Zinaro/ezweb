const express = require('express');
const Platform = require("../platform.js")
const router = express.Router();


// Platforms
router.get("/platform", async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.status(200).json(platforms);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/platform", async (req, res) => {
  try {
    const { platformName, platformImage } = req.body;
    const newPlatform = new Platform({
      platformName,
      platformImage,
    });
    const savedPlatform = await newPlatform.save();
    res.status(200).json(savedPlatform);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/platform/:id/", async (req, res) => {
  try {
    const platform = await Platform.findByIdAndDelete(req.params.id);
    if (!platform) {
      return res.status(404).send("Platform not found");
    }
    res.status(200).send("Platform deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting category");
  }
});

router.put("/platform/:id/", async (req, res) => {
  try {
    const platformId = req.params.id;
    let updateData = { platformName: req.body.platformName };

    if (req.body.platformImage) {
      updateData.platformImage = req.body.platformImage;
    }
    const updatedPlatform = await Platform.findByIdAndUpdate(
      platformId,
      updateData,
      { new: true }
    );
    res.status(200).json(updatedPlatform);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/platform/:id/", async (req, res) => {
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





module.exports = router;