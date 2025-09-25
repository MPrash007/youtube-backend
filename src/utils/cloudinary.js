import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

console.log("Cloudinary Config Check:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌",
    api_key: process.env.CLOUDINARY_API_KEY ? "✅" : "❌",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌"
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("File does not exist at path:", localFilePath);
            return null;
        }

        //upload the file on cloudinary
        console.log("Attempting to upload file:", localFilePath);
        // console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "uploads" // Optional: organize files in folders
        });

        // Clean up the local file
        fs.unlinkSync(localFilePath);
        
        // console.log("Upload successful. Cloudinary URL:", response.secure_url);
        return response;

    } catch (error) {
        console.error("Error during upload:", error.message);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}   

export {uploadOnCloudinary}