import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config/env';
import fs from "fs"

cloudinary.config({
    cloud_name:"cornerdevs0",
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localfilepath)=>{
    if(!localfilepath) return null
    try {
        const response = cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
        fs.unlink(localfilepath)
        return response
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localfilepath)
        return null
    }
}

export default uploadOnCloudinary