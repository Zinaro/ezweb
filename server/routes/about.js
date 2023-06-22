const express = require("express");
const About = require("../about.js");
const router = express.Router();


router.get('/abouts', async (req, res) => {
    try {
        const about = await About.findOne();
        if (!about) {
            return res.status(404).json({ error: 'About document not found.' });
          }
        res.json(about);
        } catch (error) {
        console.error('An error occurred while retrieving the About document:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the About document.' });
        }
});

router.put("/abouts/:id", async (req, res) => {
  try {
    const { kkvk, siteMapUrl, privacyPolicy, androidApp, iosApp, address, phone, email } = req.body;
    const aboutId = req.params.id;

    const about = await About.findById(aboutId);

    if (!about) {
      return res.status(404).json({ error: "About document not found." });
    }

    if (kkvk !== undefined) {
      about.kkvk = kkvk;
    }
    if (siteMapUrl !== undefined) {
      about.siteMapUrl = siteMapUrl;
    }
    if (privacyPolicy !== undefined) {
      about.privacyPolicy = privacyPolicy;
    }
    if (androidApp !== undefined) {
      about.androidApp = androidApp;
    }
    if (iosApp !== undefined) {
      about.iosApp = iosApp;
    }
    if (address !== undefined) {
      about.address = address;
    }
    if (phone !== undefined) {
      about.phone = phone;
    }
    if (email !== undefined) {
      about.email = email;
    }

    await about.save();

    res.json({ message: "The About document has been successfully updated." });
  } catch (error) {
    console.error("An error occurred while updating the About document:", error);
    res.status(500).json({ error: "An error occurred while updating the About document." });
  }
});


module.exports = router;
