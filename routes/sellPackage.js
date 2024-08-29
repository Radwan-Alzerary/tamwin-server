const router = require("express").Router();
const packageCotroller = require("../controllers/package.controllers");

router.get("/getall",packageCotroller.getAllPackage );
router.get("/parents",packageCotroller.getparent );
router.get("/nested/:id",packageCotroller.getNested );
router.get("/getnamelist",packageCotroller.getAllPackageName );
router.get("/getnested/:parentId",packageCotroller.getNestedFromPackageId );
router.post("/new",packageCotroller.addParentPackage );
router.patch("/newnested/:parentId",packageCotroller.addNestedPackage );
router.patch("/edit/:packageId",packageCotroller.editPackage );
router.delete("/delete/:packageId",packageCotroller.deletePackage );

module.exports = router;
