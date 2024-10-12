const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./Routes/authRouter");

const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");

const { errorHandler, notFound } = require("./middleWares/error");

require("dotenv").config();

// connecting with MongoDB
mongoose.connect(process.env.MONGODB_CONNECT)
.then(console.log("connected to MongoDB successfully ^_^"))
.catch((err) => console.log(err));

// create express app
const app = express();
app.use(express.json());

// prevent xss-( cross-side-scripting ) Attacks
app.use(xss());

// express-rate-limit
app.use(rateLimit({
  windowMs : 10 * 60 * 1000 ,  // 10 m
  max : 2000
}));

// Headers-Security-( helmet )
app.use(helmet());

// prevent http param pollution
app.use(hpp());

app.use(cors({
  origin : "http://localhost:3000"
}));

// Routers
app.use("/api/auth", authRouter);


// ERROR-HANDLER MIDDLEWARE
app.use(notFound); // must be here after routes and before errorHandler
app.use(errorHandler); // must be here after routes

app.listen(process.env.PORT, () =>
  console.log(`SERVER running successfully on port ${process.env.PORT} ^_^`)
);
