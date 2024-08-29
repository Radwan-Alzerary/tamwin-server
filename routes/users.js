const mongoose = require("mongoose");

const {
  cashirRegister,
  register,
  login,
  editAcount,
  getAll,
  logout
} = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");
const User = require("../models/user");
const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + extension);
  },
});

// Create multer instance for uploading image
const upload = multer({ storage: storage });

router.post("/", checkUser);
// router.post("/updatetoken", updateToken);
router.post("/register", register);
router.post("/edit", editAcount);
router.get("/getAll", getAll);
router.post("/addcashire", cashirRegister);
router.post("/login", login);
router.get('/logout', logout);

router.get("/checkAvailable", async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    if (users > 0) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

router.get("/allusers/", async (req, res, next) => {
  try {
    const users = await User.find({ role: "cashir" });
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/allUsers/:id/name/:name?", async (req, res, next) => {
  try {
    const userName = req.params.name ? req.params.name : "";
    const users = await User.find({
      _id: { $ne: req.params.id },
      email: { $regex: userName, $options: "i" },
    });
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get one doctor by ID
router.get("/getone/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/update/image", upload.single("image"), async (req, res, next) => {
  console.log(req.body);
  const { filename, path } = req.file;
  console.log(filename, path);
  const url = req.protocol + "://" + req.get("host");
  const imagePath = req.file ? "/img/" + req.file.filename : null;
  console.log(imagePath);
  try {
    const user = await User.findByIdAndUpdate(req.body.id, {
      profileImg: imagePath,
    });
    if (!user) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/update/image", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, req.body.data);
    if (!user) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, req.body.data);
    if (!user) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/usercheck", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      return res.json(true); // Users are available
    } else {
      return res.json(false); // No users are available
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;
