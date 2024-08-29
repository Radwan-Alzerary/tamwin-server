const router = require("express").Router();
router.use("/users", require("./users"));
router.use("/", require("./routes"));
router.use("/Category", require("./category"));
router.use("/packages", require("./sellPackage"));
router.use("/deals", require("./deals"));
router.use("/company", require("./company"));
router.use("/product", require("./product"));

// router.use('/costemers', require('./costemers'));
module.exports = router;
