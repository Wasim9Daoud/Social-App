const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  // checking if this id is objectId or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json("invalid id");
  } else {
    next();
  }
};
module.exports = validateObjectId;
