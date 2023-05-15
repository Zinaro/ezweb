const express = require('express');
const User = require("../userModel.js");
const router = express.Router();


router.get("/users", async (req, res) => {
    try {
      const items = await User.find().maxTimeMS(10000);
      res.send(items);
    } catch (error) {
      console.error(error);
      res.status(500).send("hi zinar, you have an error");
    }
  });
  router.get("/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id).maxTimeMS(10000);
      if (!user) {
        return res.status(404).send("hi zinar, user not found");
      }
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("hi zinar, you have an error");
    }
  });
  router.get("/users/username/:id", async (req, res) => {
    const username = req.params.id;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  router.post("/users", async (req, res) => {
    try {
      const user = req.body;
      const newUser = await User.create(user);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "hi zinar, you have an error" });
    }
  });
  
  router.put("/users/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });
  
  router.put("/users/:id/root", async (req, res) => {
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
  
  router.delete("/users/:id/root", async (req, res) => {
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
  router.put("/users/:id/followers", async (req, res) => {
    try {
      const { id } = req.params;
      const { followerId, userId } = req.body;
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
  
  router.put("/users/:id/following", async (req, res) => {
    try {
      const { id } = req.params;
      const { followerId, userId } = req.body;
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
  
  router.delete("/users/:id/followers", async (req, res) => {
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
  
  router.delete("/users/:id/following", async (req, res) => {
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
  router.get("/users/:id/following", async (req, res) => {
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
  router.get("/users/:id/followers", async (req, res) => {
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

module.exports = router;