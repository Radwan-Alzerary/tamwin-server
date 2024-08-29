const router = require("express").Router();
const Category = require("../models/category");
const CategoryProduct = require("../models/categoryProduct");
const Company = require("../models/company");
const CompanyCategory = require("../models/companyCategory");
const CompanyProduct = require("../models/companyProduct");
const Product = require("../models/product");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/product");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + extension);
  },
});
// Create multer instance for uploading image
const upload = multer({ storage: storage });
// Create a new product
router.post("/new", async (req, res) => {
  try {
    const product = new Product();
    await product.save();
    res.status(200).json({
      message: "surgicalProcedures added to patient successfully",
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/update", async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.body.id);
    console.log(req.body.company);
    let companyId = "";
    let categoryId = "";
    if (req.body.company.id) {
      companyId = req.body.company.id;
    } else {
      const newCompany = new Company({ name: req.body.company.name });
      await newCompany.save();
      companyId = newCompany._id.toString();
    }

    if (req.body.category.id) {
      categoryId = req.body.category.id;
    } else {
      const newCategory = new Category({ name: req.body.category.name });
      await newCategory.save();
      categoryId = newCategory._id.toString();
    }
    console.log(req.body.category);
    const product = await Product.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      description: req.body.description,
      cost: req.body.cost,
      company: companyId,
      category: categoryId,
      discountDisplay: req.body.discountDisplay,
      price: req.body.price,
      active: true,
      $push: {
        categories: {
          $each: req.body.selectedNested.map((selected) => ({
            ...selected,
            default: selected.id === req.body.defaultPackage,
          })),
        },
        mainPackage: {
          $each: req.body.selectedParent.map((id) => id.id),
        },
      },
    });

    // Remove old category-product relations
    await CategoryProduct.deleteMany({
      productId: req.body.id,
      categoryId: oldProduct.category,
    });
    // Remove old company-product relations
    await CompanyProduct.deleteMany({
      productId: req.body.id,
      companyId: oldProduct.company,
    });
    const oldCompanyCategories = await CategoryProduct.find({
      categoryId: oldProduct.category,
      companyId: oldProduct.company,
    });
    if (oldCompanyCategories.length === 0) {
      await CompanyCategory.deleteMany({
        categoryId: oldProduct.category,
        companyId: oldProduct.company,
      });
    }

    const productCategoryCheck = await CategoryProduct.findOne({
      productId: req.body.id,
      categoryId: categoryId,
    });

    if (!productCategoryCheck) {
      const productCategoryRelation = new CategoryProduct({
        productId: req.body.id,
        categoryId: categoryId,
      });
      await productCategoryRelation.save();
    }
    const productCompanyCheck = await CompanyProduct.findOne({
      companyId: companyId,
      productId: req.body.id,
    });

    if (!productCompanyCheck) {
      const productCompanyRelation = new CompanyProduct({
        companyId: companyId,
        productId: req.body.id,
      });
      await productCompanyRelation.save();
    }

    const companyCategoryCheck = await CompanyCategory.findOne({
      companyId: companyId,
      categoryId: categoryId,
    });
    if (!companyCategoryCheck) {
      const companyCategoryRelation = new CompanyCategory({
        companyId: companyId,
        categoryId: categoryId,
      });
      await companyCategoryRelation.save();
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ active: true })
      .populate("mainPackage")
      .populate("categories.id")
      .populate("company");

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/ProductInsideCategory/:id", async (req, res) => {
  try {
    const products = await CategoryProduct.find({ categoryId: req.params.id }).populate(
      "productId"
    );
    console.log(products)
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/productimages",
  upload.single("image"),
  async (req, res, next) => {
    console.log(req.body.id);
    const { filename, path } = req.file;
    const { name } = req.body;
    console.log(filename, path, name);
    const url = req.protocol + "://" + req.get("host");
    const imagePath = req.file ? "/img/product/" + req.file.filename : null;
    console.log(imagePath);
    try {
      const product = await Product.findByIdAndUpdate(
        req.body.id,
        { $push: { images: imagePath } },
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
router.post(
  "/productbackgroundimages",
  upload.single("image"),
  async (req, res, next) => {
    const imagePath = req.file ? "/img/product/" + req.file.filename : null;
    try {
      const product = await Product.findByIdAndUpdate(
        req.body.id,
        { $push: { backgroundImages: imagePath } },
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
// Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("company");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update a product by ID
router.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
