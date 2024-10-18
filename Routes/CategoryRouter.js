const router = require("express").Router();

const { verifyTokenIsAdmin } = require("../middleWares/verifyToken");
const validateObjectId = require("../middleWares/validateObjectId");
const { CreateCategoryCtrl , getAllCategoriesCtrl , updateCategoriesCtrl , deleteCategoryCtrl } = require("../controllers/CategoriesController");


// create Category
router.route("/").post( verifyTokenIsAdmin , CreateCategoryCtrl )
                 .get( getAllCategoriesCtrl );

// update Category
router.route("/:id").put( validateObjectId , verifyTokenIsAdmin , updateCategoriesCtrl )
                    .delete( validateObjectId , verifyTokenIsAdmin , deleteCategoryCtrl );



module.exports = router ;