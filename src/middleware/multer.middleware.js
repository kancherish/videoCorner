import multer from "multer";

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        const date= new Date()
        cb(null,`${date.now()}_${file.originalname}`)
    }
})

export const upload = multer({storage})