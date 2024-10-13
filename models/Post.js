const mongoose = require("mongoose");
const validator = require("validator");

// postSchema
const postSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true ,
        minlingth :  2 ,
        maxlingth : 200 ,
        trim : true
    },
    description : {
        type : String ,
        required : true ,
        minlingth :  10 ,
        trim : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" , // we will take the user from User model => relation between User & Post collections // every post has a user
        required : true
    },
    category : {
        type : String ,
        required : true
    },
    image : {
        type : Object ,
        default : {
            url : "" ,
            publicId : null
        },
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId , // every user like on post will saved it's _id 
            ref : "User"
        },
    ]
},
{ 
    timestamps : true ,
    toJSON : { virtuals : true } ,
    toObject : { virtuals : true }
}
);

postSchema.virtual("comments",
{
    ref : "Comment" ,
    foreignField : "postId" ,  
    localField : "_id"
});




// Post model
module.exports = mongoose.model("Post",postSchema);