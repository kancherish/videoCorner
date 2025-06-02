const asyncHandeler = (asyncFun)=>{
    return async (req,res,next)=>{ 
      Promise.resolve(asyncFun(req,res))
      .catch(next)
    }
}

export default asyncHandeler;