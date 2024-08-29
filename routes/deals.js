const router = require("express").Router();
const Deals = require("../models/deals");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/deals");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + extension);
  },
});

// Create multer instance for uploading image
const upload = multer({ storage: storage });

// Create a new category
router.post("/", upload.single("image"), async (req, res) => {
  const bodyData = req.body;
  console.log(req.body);
  console.log(req.file);
  if (req.file) {
    const imagePath = req.file ? "/img/deals/" + req.file.filename : null;
    bodyData.image = imagePath;
  }
  try {
    const deals = new Deals(bodyData);
    const savedDeals = await deals.save();
    res.status(201).json(savedDeals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Deals.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Deals.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Deals not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update a category by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  const bodyData = req.body;
  console.log(req.body);
  console.log(req.file);
  if (req.file) {
    const imagePath = req.file ? "/img/deals/" + req.file.filename : null;
    bodyData.image = imagePath;
  }

  try {
    const updatedCategory = await Deals.findByIdAndUpdate(
      req.params.id,
      bodyData,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Deals not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/active/:id", async (req, res) => {
  try {
    const updatedCategory = await Deals.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Deals not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Deals.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Deals not found" });
    }
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
