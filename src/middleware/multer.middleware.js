import multer from "multer";

let Upload;

try {
    
    
    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"./public/temp")
        },
        filename:function(req,file,cb){
            cb(null,`${Date.now()}_${file.originalname}`)
        }
    })
    
    Upload = multer({storage})
    
} catch (error) {
    console.error(error)
}

export default Upload