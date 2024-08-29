const router = require("express").Router();
const Company = require("../models/company");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/company");
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
  console.log(req.body)
  console.log(req.file)
  const imagePath = req.file ? "/img/company/" + req.file.filename : null;
  bodyData.image = imagePath;
  try {
    const category = new Company(bodyData);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Company.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Company.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update a category by ID
router.put("/:id",upload.single("image"), async (req, res) => {
  const bodyData = req.body;
  console.log(req.body)
  console.log(req.file)
  if(req.file){
    const imagePath = req.file ? "/img/Company/" + req.file.filename : null;
    bodyData.image = imagePath;
  
  }

  try {
    const updatedCategory = await Company.findByIdAndUpdate(
      req.params.id,
      bodyData,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/active/:id", async (req, res) => {
  try {
    const updatedCategory = await Company.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
