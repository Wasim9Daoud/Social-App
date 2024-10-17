const router = require("express").Router();
const {
  verifyToken,
  verifyTokenIsAdmin,
} = require("../middleWares/verifyToken");
const validateObjectId = require("../middleWares/validateObjectId");
const {
  createPostCtrl,
  getPostsCtrl,
  getSinglePostCtrl,
  getPostsCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updatePostImage,
  ToggleLikePost,
} = require("../controllers/postController");
const photoUpload = require("../middleWares/photoUpload");

// GET-POSTS-COUNT
router.get("/count", getPostsCountCtrl); // verifyTokenIsAdmin انا بدلت شلت الفيريفاي اند اوثورايز وحطيت فيريفاي اند ادمين          verifyTokenAndAuthorization

// GET ALL POSTS
router.get("/", getPostsCtrl); // verifyToken انا حذفتو  من عندي بلا ما اتاكد من الفيديوهات

// GET SINGLE POST
router.get("/:id", validateObjectId, getSinglePostCtrl);//كمان انا حذفت الفيريفاي توكن من عندي

// CREATE POST
router.post("/", verifyToken , photoUpload.single("image") , createPostCtrl);

// DELETE POST
router.delete("/:id", validateObjectId, verifyToken, deletePostCtrl);

// UPDATE POST
router.put("/:id", validateObjectId, verifyToken, updatePostCtrl);

// UPDATE POST-IMAGE
router.put(
  "/update-image/:id",
  validateObjectId,
  verifyToken,
  photoUpload.single("image"),
  updatePostImage
);

// TOGGLE-LIKE-POST
router.put("/like/:id", validateObjectId, verifyToken, ToggleLikePost);

module.exports = router;
