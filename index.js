const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const authRouter = require("./Routes/authRouter");
const usersRouter = require("./Routes/usersRouter");
const postRouter = require("./Routes/postRouter");
const commentRouter = require("./Routes/CommentsRouter");
const categoryRouter = require("./Routes/CategoryRouter");

const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");

const { errorHandler, notFound } = require("./middleWares/error");

require("dotenv").config();

// connecting with MongoDB
mongoose.connect('mongodb+srv://wasim:wasim@cluster0.vnemq.mongodb.net/chatDB?retryWrites=true&w=majority&appName=Cluster0').then(console.log("connected to MongoDB successfully ^_^")).catch((err) => console.log(err));

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
app.use("/api/users", usersRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/categorY", categoryRouter);

// ERROR-HANDLER MIDDLEWARE
app.use(notFound); // must be here after routes and before errorHandler
app.use(errorHandler); // must be here after routes

app.listen(process.env.PORT, () =>
  console.log(`SERVER running successfully on port ${process.env.PORT} ^_^`)
);
