const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../model/user");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const fileName = req.body.filename;
    const fileSize = req.body.filesize;
   
    const result = await cloudinary.uploader.upload(req.file.path);

   
    let user = new User({
      name: req.body.name,
      imgUrl: result.secure_url,
      cloudinary_id: result.public_id,
      isBin: false,
      filename: fileName,
      filesize: fileSize
    });
  
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let user = await User.find();
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Delete user from db
    await user.remove();
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    const data = {
      _id: user._id,
      imgUrl: user.imgUrl,
      cloudinary_id: user.cloudinary_id,
      isBin: !user.isBin,
      filename: user.filename,
      filesize: user.filesize
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
