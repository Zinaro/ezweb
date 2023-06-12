const express = require('express');
const Market = require("../market.js")
const router = express.Router();


// Products
router.get("/products", async (req,res) => {
  try {
    const products = await Market.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/product", async (req, res) => {
  try {
    const { productName, productImage, platforms } = req.body;
    const newProduct = new Market({
      productName: productName,
      productImage: productImage,
      platforms: platforms,
    });
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/product/delete/:id", async (req, res) => {
   try {
   const productID = req.params.id;
   console.log(productID);
   await Market.deleteOne({ _id: productID});
   res.status(200).json({ message: "Product deleted."});
} 
   catch (error) {
  res.status(500).json({ error: error.message});
}
});





module.exports = router;
