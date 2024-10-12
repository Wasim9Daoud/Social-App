const mongoose = require("mongoose");

// user Schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 25,
      trim : true
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 40,
      trim : true ,
      unique: true,
    },
    passWord: {
      type: String,
      required: true,
      min: 5,
      trim : true
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type : String ,
      default : ""
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true , 
    toJSON : { virtuals: true } ,
    toObject : { virtuals: true }
  }
);

// populate all posts that belong to single profile we want to get it
userSchema.virtual( "posts" , {
  ref : "Post" ,
  foreignField : "user" ,
  localField : "_id"
} );


//** */ first-step **//
/*userSchema.virtual( "name" , {                                                                      
  ref : "Post" ,                       // the Model that we need to make relation with it
  foreignField : "user" ,              // name of external field ( in Model )
  localField : "_id" ,                 // this _id is internal field that mongoose added to every Model created
} )  */


//** */ second-step **//
// { timestamps: true ,           
//   toJSON : { virtuals: true } ,
//   toObject : { virtuals: true }    // must be added to Schema to be virual() able to work
// }
// note foreignField === localField


//** */ third-step **//
// to use the virtual where we need it we must use populate("name")


// user Model
module.exports = mongoose.model("User", userSchema);
