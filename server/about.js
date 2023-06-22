const mongoose = require("mongoose");
 
const aboutSchema = new mongoose.Schema({

  kkvk: String,

  siteMapUrl: {
    type: String,
    unique: true,
  },
  privacyPolicy: {
    type: String,
  },
  androidApp: {
    type: String,
    unique: true,
  },
  iosApp: {
    type: String,
    unique: true,
  },
  address: String,
  phone: String,
  email: String
},);



const About = mongoose.model("About", aboutSchema);

const createAboutDocument = async () => {
  try {
    const about = await About.findOne();

    if (!about) {
      const newAbout = new About({
        kkvk: "",
        siteMapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12691.250143550491!2d40.7250905!3d37.323268!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x77df3d70a28e519f!2sNuhev%20Company!5e0!3m2!1str!2str!4v1673975041018!5m2!1str!2str",
        privacyPolicy: "",
        androidApp: "",
        iosApp: "",
        address: "",
        phone: "",
        email: "",
      });
      await newAbout.save();
      console.log("About document created successfully.");
    } else {
      console.log("About document already exists.");
      console.log(about);
    }
  } catch (error) {
    console.error("An error occurred while creating the About document:", error);
  }
};

createAboutDocument();

module.exports = About;
