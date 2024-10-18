const router = require("express").Router() ;
const { verifyToken , verifyTokenAndAuthorization , verifyTokenIsAdmin } = require("../middleWares/verifyToken"); // verifyTokenAndAuthorization
const validateObjectId = require("../middleWares/validateObjectId");
const { createCommentCtrl , getAllCommentsCtrl , deleteCommentCtrl , updateCommentCtrl } = require("../controllers/commentControllers");

                  // create comment
router.route("/").post( verifyToken , createCommentCtrl )
                  // get all comments
                 .get( verifyTokenIsAdmin , getAllCommentsCtrl );

                    // create comment
router.route("/:id").delete( validateObjectId , verifyToken , deleteCommentCtrl )
                    .put( validateObjectId , verifyToken , updateCommentCtrl );

module.exports = router ;