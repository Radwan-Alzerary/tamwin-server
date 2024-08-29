const express = require("express");
const router = express.Router();
const Address = require("../models/address");

// Create a new address
router.post("/", async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).send(address);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all addresses
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find({});
    res.status(200).send(addresses);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single address by ID
router.get("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).send();
    }
    res.status(200).send(address);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an address by ID
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["phoneNumber", "countery", "governorate", "city", "Region", "nearestPlace"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).send();
    }

    updates.forEach((update) => (address[update] = req.body[update]));
    await address.save();

    res.send(address);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an address by ID
router.delete("/:id", async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);

    if (!address) {
      return res.status(404).send();
    }

    res.status(200).send(address);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
