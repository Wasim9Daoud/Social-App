const router = require("express").Router();
const {
  getAllUsersCtrl,
  getSingleProfileCtrl,
  updateProfile,
  getUsersCountCtrl,
  deleteSingleProfileCtrl,
  uploadImageCtrl,
} = require("../controllers/usersController");

const {
  verifyToken,
  verifyTokenIsAdmin,
  verifyTokenAndAuthorization,
} = require("../middleWares/verifyToken");

const validateObjectId = require("../middleWares/validateObjectId");

const photoUpload = require("../middleWares/photoUpload");

// GET USERS COUNT (Admin)
router.get("/count", verifyTokenIsAdmin, getUsersCountCtrl);

// GET ALL PROFILES (Admin)
router.get("/profile", getAllUsersCtrl); //verifyTokenIsAdmin

// UPLOAD-PHOTO (Logged In)
router.post("/profile/upload-profile-image",
  verifyToken,
  photoUpload.single("image"),
  uploadImageCtrl
);

// GET SINGLE PROFILE (public)
router.get("/profile/:id", validateObjectId, getSingleProfileCtrl);

// UPDATE PROFILE
router.put("/profile/:id", validateObjectId, verifyToken, updateProfile);

// DELETE PROFILE // there is too many things to do in future when we create posts
router.delete("/profile/:id",
  validateObjectId,
  verifyTokenAndAuthorization,
  deleteSingleProfileCtrl
);

module.exports = router;
