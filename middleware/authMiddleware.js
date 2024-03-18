const jwt = require("jsonwebtoken");
const ACCESS_KEY = process.env.ACCESS_TOKEN;

const middleware = async (req, res, next) => {
    // Authentication middleware logic
    try{
        const auth=req.header("x-token");
        if(!auth) return  res.status(400).json({"msg":"token not found"})
        const data=await jwt.verify(auth,ACCESS_KEY);
        if(!data) return  res.status(400).json({"msg":"token invaild"})

         req.data=data;
        next();
    }
    catch(err){
        return res.status(400).json({"msg":"error ocuured at server"})
    }
};

module.exports = middleware;
