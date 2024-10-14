const jwt = require("jsonwebtoken");
const User = require("../models/User");

// verify-token (checking if there is token & is valid)
const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.SECRETKEY);
      req.tokenPayload = decodedPayload;
      next();
    } catch (error) {
      res.status(401).json("Access Denied Please Login first");
    }
  } else {
    res.status(401).json("no token provided");
  }
};

// verify-token-&-himself (checking if there is token & is valid & is profile owner )
const verifyTokenAndHimself = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.params.id === req.tokenPayload._id) {
      next();
    } else {
      res
        .status(403)
        .json(" access denied.. only Admin or profile owner ");
    }
  });
};

// verify-token-isAdmin (checking if there is token & is valid $ is Admin)
const verifyTokenIsAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    const adminUser = req.tokenPayload.isAdmin;
    if (adminUser) {
      try {
        next();
      } catch (error) {
        res.status(401).json( error );
      }
    } else {
      res.status(403).json(" Access Denied .. only Admin ");
    }
  });
};

// verify-token-&-Authorization (checking if there is token & is valid & is profile owner || isAdmin )
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.params.id === req.tokenPayload._id || req.tokenPayload.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json("access denied.. only Admin or profile owner ");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenIsAdmin,
  verifyTokenAndHimself,
  verifyTokenAndAuthorization,
};
