const cloudinary = require("cloudinary").v2;

// 1- config()    ( cloudName , Api-key , Api-secret)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2- Cloudinary-upload-image     async function( fileToUpload )
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload); // return data( url , publicUrl ...)
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("internal server error ( cloudinary )");
    }
};

// 3- Cloudinary-delete-image     async function( PublicId )
const cloudinaryDeletedImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("internal server error ( cloudinary )");  }
};

module.exports = { cloudinaryUploadImage, cloudinaryDeletedImage };
