const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const path = require("path");
const { cloudinaryUploadImage } = require("../uitils/cloudinary");

const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const VerifyEmail = require("../uitils/VerifyEmail");


//************  REGISTER-CONTROLLER ***************/
// RegisterHandler method for (validation & checking-Fields & hashing-passWord)
const RegisterHandler = async (userName, passWord, email) => {
  // check if there any empty field
  if (!userName || !email || !passWord) {
    throw Error("all Fields are Required");
  }

  // validation
  // email validation
  if (!validator.isEmail(email)) {
    throw Error("invalid Email");
  }
  // passWord validation
  if (!validator.isStrongPassword(passWord)) {
    throw Error("Weak password please Add symbols,letters and numbers please");
  }
  // check if this Email is already exist or not
  const user = await User.findOne({ email });
  if (user) {
    throw Error("this Email is already exist");
  }
  // hashing the PassWord
  const salt = await bcrypt.genSalt(10);
  const hashPassWord = await bcrypt.hash(passWord, salt);
  // create a new user
  const newUser = await User.create({
    userName,
    email,
    passWord: hashPassWord,
  });

  await newUser.save();
  return newUser;
};

// Register Controller
const Register = async (req, res) => {
  const { userName, passWord, email } = req.body;
  try {
    // register user
    const user = await RegisterHandler(userName, passWord, email);

    // create verification token & save it into DB
    const verificationToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    verificationToken.save();

    //create link
    const link = `http://localhost:3000/${user._id}/verify-email/${verificationToken.token}`;

    //create html template for link
    const htmlTemplate = `
    <div>
       <p> Please Click on Verify link to verify your Email </p>
       <a href=${link}>Verify</a>
    </div>
    `;

    //send Email to user
    VerifyEmail(user.email, "Verify Your Email", htmlTemplate);

    // send userData & token
    res.status(200).json({
      message:
        " please check your email and complete Email-Verification Process ",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
/*********************************************************************/

//**********************  LOG-IN-CONTROLLER **************************/

// Login method for (checking-Fields & hashing-passWord)
const LoginHandler = async (email, passWord) => {
  // check if there any empty field
  if (!email || !passWord) {
    throw Error("all Fields must be filled");
  }
  // check if this Email is exist or not
  const user = await User.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  // check if the PassWord correct
  const matched = await bcrypt.compare(passWord, user.passWord);
  if (!matched) {
    throw Error("Incorrect PassWord");
  }
  return user;
};

// Login Controller
const Login = async (req, res) => {
  const { email, passWord } = req.body;
  try {
    // (checking & hashing-passWord) using LoginHandler
    const user = await LoginHandler(email, passWord);

    // check if email is verified or not
    if (!user.isAccountVerified) {
      res
        .status(400)
        .json({ message: "Access Denied.. your email is not verified" });
    }

    // generating a token
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.SECRETKEY
    );
    
    // send userData & token to client
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// VerifyEmailCtrl
const VerifyEmailCtrl = async (req, res) => {
  const { userId, token } = req.params;

  const verifiedEmail = await VerificationToken.findOne({
    userId,
    token,
  });

  if (verifiedEmail) {
    const user = await User.findById(userId);
    user.isAccountVerified = true;
    await user.save();

    await VerificationToken.deleteMany();

    res
      .status(200)
      .json({ message: "your Email has been verified successfully" });
  } else {
    res.status(400).json({ message: "Access Denied with this email" });
  }
};

// ResetPassWordRequest
const ResetPassWordRequest = async (req, res) => {
  const { email } = req.params;

  // get the user
  const user = await User.findOne({ email });

  if (user) {
    // create verification-token & save it into DB
    const verificationToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    verificationToken.save();

    // create link
    const link = `http://localhost:3000/${user._id}/reset-password/${verificationToken.token}`;

    // create html template
    htmlTemplate = `
    <div>
       <p>please click on this link to change your password</p>
       <a href=${link}>reset your password</a>
    </div>
    `;
    // send email
    VerifyEmail(user.email, "Rest your password", htmlTemplate);

    // send response to client
    res
      .status(200)
      .json("please check your email to complete reset your password process");
  } else {
    res
      .status(404)
      .json("this email is not exist.. try with another one please");
  }
};

// ResetPassWord
const ResetPassWord = async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  const verify = await VerificationToken.findOne({ userId });

  if (verify) {
    // generating-salt & hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // changing password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          passWord: hashPassword,
        },
      },
      { new: true }
    );

    // delete all VerificationToken(s)
    await VerificationToken.deleteMany();

    // send respone to client
    res.status(200).json("password has been changed successfully");
  } else {
    res.status(404).json("Access Denied.. you can't reset password");
  }
};

module.exports = {
  Register,
  Login,
  VerifyEmailCtrl,
  ResetPassWordRequest,
  ResetPassWord,
};
