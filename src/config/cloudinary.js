import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from './env.js';
import fs from "fs"

cloudinary.config({
    cloud_name:"cornerdevs0",
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
})

let response;

const uploadOnCloudinary = async (localfilepath)=>{
    if(!localfilepath) return null
    try {
        response = await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
        fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        if (response) {
            await DeleteFromCloudinary(response.public_id)
        }
        console.log(error)
        fs.unlinkSync(localfilepath)
        return null
    }
}


export async function DeleteFromCloudinary (id){
    try {
        const res = await cloudinary.uploader.destroy(id)
        if (res.result!=="ok") {
            console.warn("failed to delete")
        }
    } catch (error) {
        console.log(error,"failed to delete from cloudinary")
        process.exit(1)
    }
}

export default uploadOnCloudinary