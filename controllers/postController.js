const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Comment = require("../models/Comment");
const {
  cloudinaryUploadImage,
  cloudinaryDeletedImage,
} = require("../uitils/cloudinary");

/**********************************************/
// description : CREATE-POST
//      method : POST
//       route : api/posts
//      access : private only( logged in )
/**********************************************/
const createPostCtrl = async (req, res) => {
  // 1- validation image
  if (!req.file) {
    res.status(400).json({ message: " no photo provided " });
  }

  // 2- upload photo to cloudinary
  const image = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(image);

  // 3- create new post and save it into DB
  const { title, description, category } = req.body;
  const post = await Post.create({
    title,
    description,
    category,
    user: req.tokenPayload._id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // 4- send response to client
  res.status(200).json({
    message: "post created successfully",
    post,
  });

  // 5- delete photo from server (from image folder)
  fs.unlinkSync(image);
};

/**********************************************/
// description : GET-ALL-POSTS
//      method : GET
//       route : api/posts
//      access : public
/**********************************************/

const getPostsCtrl = async (req, res) => {
  const PostsPearPage = 3;
  const { pageNumber, category, id } = req.query;
  try {
    // check if user send a query
    // pageNumber query sent
    if (pageNumber) {
      const posts = await Post.find()
        .skip((pageNumber - 1) * PostsPearPage)
        .limit(PostsPearPage)
        .sort({ createdAt: -1 })
        // get userOwner with all properties without passWord
        .populate("user", ["-passWord"]).populate("comments").populate("likes");
      res.status(200).json(posts);
      // category query sent
    } else if (category) {
      const posts = await Post.find({ category })
        .sort({ createdAt: -1 })
        // get userOwner with all properties without passWord
        .populate("user", ["-passWord"]).populate("comments").populate("likes");;
      res.status(200).json(posts);
    } else if (id) {
      const posts = await Post.find({ user: id })
        .sort({ createdAt: -1 })
        .populate("comments").populate("user", ["-passWord"]).populate("likes");;
      res.status(200).json(posts);
    } else {
      // no query sent so get all posts
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        // get userOwner with all properties without passWord
        .populate("user", ["-passWord"]).populate("comments");
      if(!posts){throw new Error("no data coming from data-base")}
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};



/**********************************************/
// description : GET-SINGLE-POST
//      method : GET
//       route : api/posts/:id
//      access : public
/**********************************************/

const getSinglePostCtrl = async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id })
      .populate("user", ["-passWord"])
      .populate("comments");
    if (!post) {
      res.status(404).json("post not found");
    } else {
      res.status(200).json(...post);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

/**********************************************/
// description : GET-POSTS-COUNT
//      method : GET
//       route : api/posts/count
//                                       access : private only ( Admin )
//      access : public
/**********************************************/

const getPostsCountCtrl = async (req, res) => {
  try {
    const count = await Post.count();
    res.status(200).json(count);
  } catch (error) {
    res.status(400).json(error);
  }
};

// /**********************************************/
// // description : DELETE-POST
// //      method : DELETE
// //       route : api/posts/:id
// //      access : private only ( Admin & post owner )
// /**********************************************/

const deletePostCtrl = async (req, res) => {
  try {
    // get post owner
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "post not found" });
    }
    // check if is a post-owner or Admin
    if (req.tokenPayload._id == post.user || req.tokenPayload.isAdmin) {
      // or   req.tokenPayload._id === post.user.toString()
      // 2- get post image & delete it from cloudinary
      if (post.image.publicId !== null) {
        result = await cloudinaryDeletedImage(post.image.publicId);
      }

      // delete all comments that belong to this post
      await Comment.deleteMany({ postId: post._id });

      // 3- delete post
      await Post.findByIdAndDelete(req.params.id);
      // 4- send response to client
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res
        .status(403)
        .json({ error: "access denied.. only Admin or Post Owner" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// /**********************************************/
// // description : UPDATE-POST
// //      method : PUT
// //       route : api/posts/:id
// //      access : private only ( post owner )
// /**********************************************/
const updatePostCtrl = async (req, res) => {
  try {
    // 1- get post
    const post = await Post.findById(req.params.id);

    // 2- check if post exist or not
    if (!post) {
      res.status(404).json({ error: "post not found" });
    }
    // 3-check if loggedIn and post owner is the same
    if (req.tokenPayload._id !== post.user.toString()) {
      res
        .status(403)
        .json({ error: "access denied.. only post owner can update it" });
    }
    // 4- update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
        },
      },
      { new: true }
    ).populate("user", ["-password"]);
    // 5- send response to client
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**********************************************/
// description : UPDATE-IMAGE-OF-POST
//      method : PUT
//       route : api/posts/upload-image/:id
//      access : private only ( post owner )
/**********************************************/
const updatePostImage = async (req, res) => {
  try {
    // 1- get post
    const post = await Post.findById(req.params.id);
    // 2- check if post exist or not
    if (!req.file) {
      res.status(404).json({ error: "no photo provided" });
    }
    // 3-check if loggedIn and post owner is the same
    if (req.tokenPayload._id !== post.user.toString()) {
      res
        .status(403)
        .json({ error: "access denied.. only post owner can update it" });
    }

    // 4-delete the old image from cloudinary
    await cloudinaryDeletedImage(post.image.publicId);

    // 5-upload new image to cloudinary
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // 6-update image field in dataBase
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        },
      },
      { new: true }
    );

    // 7- send response to client
    res.status(200).json({ message: "post updated successfully", updatedPost });

    // 8- remove image from server
    fs.unlinkSync(imagePath);
  } catch (error) {
    res.status(400).json( error );
  }
};

/**********************************************/
// description : TOGGLE-LIKE-POST
//      method : PUT
//       route : api/posts/like/:id
//      access : private only ( logged in user )
/**********************************************/

const ToggleLikePost = async (req, res) => {
  let post = await Post.findById(req.params.id);
  try {
    if (!post) {
      res.status(404).json({ message: "post not found" });
    }
    // check if loggeIn user is already like on this post or not
    const isLiked = post.likes.find(
      (user) => user.toString() === req.tokenPayload._id
    );
    // isLiked
    if (isLiked) {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: req.tokenPayload._id },
        },
        { new: true }
      ).populate("likes", ["-password"]);//.populate("likes", ["-password"])
      // isUnLike yet
    } else {
      post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: req.tokenPayload._id },
        },
        { new: true }
      ).populate("likes", ["-passWord"]);//.populate("likes", ["-passWord"])
    }
    // send response to client
    res.status(200).json( post );
  } catch (error) {
    res.status(400).json( error );
  }
};

module.exports = {
  createPostCtrl,
  getPostsCtrl,
  getSinglePostCtrl,
  getPostsCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updatePostImage,
  ToggleLikePost,
};
