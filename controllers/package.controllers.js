const Package = require("../models/sellPackage"); // Adjust the path as needed
async function getPackageAndChildren(packageId) {
  const package = await Package.findById(packageId).exec();
  if (!package) {
    return null; // Package not found
  }

  // Recursively fetch children packages
  const children = await Promise.all(
    package.childrenPackage.map((childId) => getPackageAndChildren(childId))
  );

  return {
    name: package.name,
    id: package.id,
    fillings: package.fillings,
    active: package.active,
    children: children.filter((child) => child !== null), // Filter out null (for not found children)
  };
}

// Function to retrieve all packages with nestedNum = 0 and build the nested structure for each
async function getRootPackagesAndChildren() {
  const rootPackages = await Package.find({ nestedNum: 0 }).exec();

  const nestedStructures = await Promise.all(
    rootPackages.map((rootPackage) => getPackageAndChildren(rootPackage._id))
  );

  return nestedStructures.filter((structure) => structure !== null); // Filter out null (for not found root packages)
}

async function getRootPackagesAndChildrenFromId(packageId) {
  const rootPackages = await Package.find({ _id: packageId }).exec();

  const nestedStructures = await Promise.all(
    rootPackages.map((rootPackage) => getPackageAndChildren(rootPackage._id))
  );

  return nestedStructures.filter((structure) => structure !== null); // Filter out null (for not found root packages)
}

exports.getAllPackage = async (req, res) => {
  try {
    const nestedStructures = await getRootPackagesAndChildren();
    if (nestedStructures.length > 0) {
      res.json(nestedStructures);
    } else {
      res
        .status(404)
        .json({ message: "No root packages with nestedNum = 0 found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getparent = async (req, res) => {
  try {
    const package = await Package.find({ nestedNum: 0 });
    res.json(package);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getNested = async (req, res) => {
  console.log(req.params.id);
  console.log(req.params.id);

  try {
    const package = await Package.findById(req.params.id).populate("childrenPackage")
    console.log(package.childrenPackage);

    if (package) {
      res.json(package.childrenPackage);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.getNestedFromPackageId = async (req, res) => {
  const pacakgeId = req.params.parentId;
  try {
    const nestedStructures = await getRootPackagesAndChildrenFromId(pacakgeId);
    if (nestedStructures.length > 0) {
      res.json(nestedStructures);
    } else {
      res
        .status(404)
        .json({ message: "No root packages with nestedNum = 0 found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPackageName = async (req, res) => {
  try {
    const rootPackages = await Package.find().exec();
    if (rootPackages.length > 0) {
      res.json(rootPackages);
    } else {
      res
        .status(404)
        .json({ message: "No root packages with nestedNum = 0 found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPackage = async (req, res) => {
  const packageId = req.params.id;
  Package.findById(packageId)
    .populate("childrenPackage")
    .exec((err, package) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to retrieve package" });
      }
      if (!package) {
        return res.status(404).json({ error: "Package not found" });
      }

      res.status(200).json(package);
    });
};

exports.addParentPackage = async (req, res) => {
  console.log(req.body);
  const package = new Package({
    name: req.body.name,
    nestedNum: 0,
    isNested: false,
    fillings: 0,
  });

  try {
    const newPackage = await package.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addNestedPackage = async (req, res) => {
  const parentId = req.params.parentId;
  console.log(parentId);
  try {
    const parentPackage = await Package.findById(parentId)
      .populate("childrenPackage")
      .exec();

    if (!parentPackage) {
      return res.status(404).json({ error: "Parent Package not found" });
    }

    const nestedPackage = new Package({
      name: req.body.name,
      nestedNum: parentPackage.nestedNum + 1,
      isNested: true,
      fillings: req.body.fillings,
      parentId: parentId,
    });
    parentPackage.childrenPackage.push(nestedPackage);

    // Save both the parent and the nested package
    await Promise.all([nestedPackage.save(), parentPackage.save()]);
    res.status(201).json(nestedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve or create package" });
  }
};

exports.editPackage = async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.packageId,
      req.body,
      { new: true }
    );
    if (updatedPackage) {
      res.json(updatedPackage);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  const packageId = req.params.packageId;

  try {
    // Find the package to be deleted
    const deletedPackage = await Package.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    // Get the parent ID of the deleted package
    const parentId = deletedPackage.parentId;

    // Update the parent package to remove the deleted package's ID from its childrenPackage array
    await Package.updateOne(
      { _id: parentId },
      { $pull: { childrenPackage: packageId } }
    );

    try {
      const nestedStructures = await getRootPackagesAndChildren();
      if (nestedStructures.length > 0) {
        res.json(nestedStructures);
      } else {
        res
          .status(404)
          .json({ message: "No root packages with nestedNum = 0 found." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
