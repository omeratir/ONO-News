const Category = require("../models/category");

exports.createCategory = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const category = new Category({
    name: req.body.name,
    creator: req.userData.userId
  });
  category.save()
    .then(createdCategory => {
      res.status(201).json({
        message: "Category added successfully",
        category: {
          ...createdCategory,
          id: createdCategory._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating category failed!"
      });
    });
};

exports.updateCategory = (req, res, next) => {
  const category = new Category({
    _id: req.body.id,
    name: req.body.name,
    creator: req.userData.userId
  });
  category.updateOne({ _id: req.params.id, creator: req.userData.userId }, category)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate category!"
      });
    });
};

exports.getCategories = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const categoryQuery = Category.find();
  let fetchedCategories;
  if (pageSize && currentPage) {
    categoryQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  categoryQuery
    .then(documents => {
      fetchedCategories = documents;
      return Category.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Categories fetched successfully!",
        categories: fetchedCategories,
        maxCategories: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Categories failed!"
      });
    });
};

exports.getCategory = (req, res, next) => {
  Category.findById(req.params.id)
    .then(category => {
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "category not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching category failed!"
      });
    });
};

exports.deleteCategory = (req, res, next) => {
  Category.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting category failed!"
      });
    });
};
