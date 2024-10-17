const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");


/**********************************************/
// description : CREATE NEW COMMENT
//      method : POST
//       route : api/users/comments
//      access : private only( logged-In )
/**********************************************/

const createCommentCtrl = async ( req , res )=>{
    try {

        if( !req.body.text ){
            res.status(400).json({error:" text field is required"})
        }

        // get user to get userName for comment
        const user = await User.findById( req.tokenPayload._id );

        // create new comment
        const comment = await Comment.create({
            postId :  req.body.postId ,
            text : req.body.text ,
            userName : user.userName ,
            user : req.tokenPayload._id 
        });

        // send response to client
        res.status(201).json(comment);

    } catch (error) {
        res.status(400).json(error)
    }
}


/**********************************************/
// description : GET ALL COMMENTS
//      method : GET
//       route : api/users/comments
//      access : private only( ADMIN )
/**********************************************/

const getAllCommentsCtrl = async ( req , res )=>{
    try {
        const comments = await Comment.find().populate("postId").populate("user",["-passWord"]).sort({ createdAt : -1 }); 
        res.status(200).json(comments)
    } catch (error) {
        res.status(400).json(error)
    }
}

/*****************************************************/
// description : DELETE COMMENT
//      method : DELETE
//       route : api/users/comments/:id
//      access : private only( ADMIN & COMMENT-OWNER )
/*****************************************************/

const deleteCommentCtrl = async ( req , res )=>{
    try {
        // get comment
        const comment = await Comment.findById( req.params.id );
        // get post
        // const post = await Post.findById( comment.postId );
        if( !comment ){
            res.status(404).json({error:"comment which you want to delete it not found"})
        }
        if ( req.tokenPayload._id === comment.user.toString() || req.tokenPayload.isAdmin ){
                    // delete the comment from dataBase
        await Comment.findByIdAndDelete( req.params.id );
        res.status(200).json({message:"comment deleted successfully"})
        }else{
            res.status(403).json({message:"access denied.. only Admin and comment owner can delete this comment"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


/*****************************************************/
// description : UPDATE COMMENT
//      method : PUT
//       route : api/users/comments/:id
//      access : private only( COMMENT-OWNER )
/*****************************************************/

const updateCommentCtrl = async ( req , res )=>{
    try {
        // get comment
        const comment = await Comment.findById( req.params.id );
        // get post
        // const post = await Post.findById( comment.postId );
        if( !comment ){
            res.status(404).json({error:"comment which you want to update it not found"})
        }
        if ( req.tokenPayload._id === comment.user.toString() ){

        // update the comment 
        const updatedComment = await Comment.findByIdAndUpdate( req.params.id , {
            $set : {
                text : req.body.text
            }
        } , { new : true } );
        res.status(200).json(updatedComment)
        }else{
            res.status(403).json({message:"access denied.. only comment owner can update this comment"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


module.exports = { createCommentCtrl , getAllCommentsCtrl , deleteCommentCtrl , updateCommentCtrl } ;



