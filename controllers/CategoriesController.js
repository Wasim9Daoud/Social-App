const Category = require("../models/Category");

/**********************************************/
// description : CREATE NEW CATEGORY
//      method : POST
//       route : api/categories
//      access : private only( ADMIN )
/**********************************************/

const CreateCategoryCtrl = async (req, res) => {
  try {
    if (!req.body.title) {
      res.status(400).json({ error: "title field is required" });
    }
    const category = await Category.create({
      title: req.body.title,
      user: req.tokenPayload._id,
    });
    res.status(200).json({ category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**********************************************/
// description : GET - ALL - CATEGORY
//      method : POST
//       route : api/categories
//      access : private only( ADMIN )
/**********************************************/

const getAllCategoriesCtrl = async (req, res) => {
  try {
    const categories = await Category.find().populate("user", ["-passWord"]);
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**********************************************/
// description : UPDATE CATEGORY
//      method : PUT
//       route : api/category/:id
//      access : private only( ADMIN )
/**********************************************/

const updateCategoriesCtrl = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ error: "category not found" });
    }
    if (!req.body.title) {
      res.status(400).json({ error: "no data provided to update" });
    }
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
          },
        },
        { new: true }
      );
      res.status(200).json({ updatedCategory });
  } catch (error) {
    res.status(400).json(error);
  }
};

/**********************************************/
// description : DELETE CATEGORY
//      method : DELETE
//       route : api/category/:id
//      access : private only( ADMIN )
/**********************************************/

const deleteCategoryCtrl = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ error: "category not found" });
    }
    await Category.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "category has been deleted successfully " });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  CreateCategoryCtrl,
  getAllCategoriesCtrl,
  updateCategoriesCtrl,
  deleteCategoryCtrl,
};
