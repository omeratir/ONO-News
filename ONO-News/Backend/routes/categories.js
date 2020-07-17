const express = require("express");

const CategoryController = require("../controllers/categories");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/", checkAuth, extractFile, CategoryController.createCategory);

router.put("/:id", checkAuth, extractFile, CategoryController.updateCategory);

router.get("", CategoryController.getCategories);

router.get("/:id", CategoryController.getCategory);

router.delete("/:id", checkAuth, CategoryController.deleteCategory);

module.exports = router;
