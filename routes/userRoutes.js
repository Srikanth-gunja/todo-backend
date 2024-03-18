const express = require("express");
const router = express.Router();
const UserModel = require("../UserModel");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var nodemailer = require('nodemailer');
const sendVerfication=require('../EmailSender')
const ACCESS_KEY = process.env.ACCESS_TOKEN;
const date=new Date();
const timeAndDate=date.getDate()+"/"+date.getMonth()+"/"+date.getYear()+"  " +date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
//router.use(express.json());
router.post("/register", async (req, res) => {
    const {username,email,password}=req.body;
    try{
        if(await UserModel.findOne({username})) return res.status(400).json({"msg":"username already taken"});
        if(await UserModel.findOne({email})) return res.status(400).json({"msg":"email already taken"});
        //const h_password=await bcrypt.hash(password,10);
        //console.log(h_password)
        const new_user=new UserModel({
            username,
            email,
            password
        })
        await new_user.save();
        console.log(`creating new user ${timeAndDate}`)
        return res.status(200).json({"msg":"Account created successfully"})
}
    catch(err){
        console.log(`error ocured while creating new user ${timeAndDate}`);
        return res.status(400).json({"msg":"error ocuured at server"})
    }
});

router.post("/login", async (req, res) => {
    // Login route logic
    const {email,password}=req.body;
    try{
        //const h_password=await bcrypt.hash(password,10);
        const user=await UserModel.findOne({email});
        if(!user) return res.status(400).json({"msg":"user not found"})
        if(!(user.password===password)) return res.status(400).json({"msg":"password incorrect"})

         const token=await jwt.sign({id : user._id},ACCESS_KEY)

        return res.status(200).json({"msg":"login successfully",token})
}
    catch(err){
        
        console.log(`error ocured while creating new user ${timeAndDate}`);
        return res.status(400).json({"msg":"error ocuured at server"})
    }
});

router.post('/forgot',async (req,res)=>{
    try{
        const {email}=req.body;
        email.trim()
        const user=await UserModel.findOne({email});
        if(!user) return res.status(400).json({"msg":"user not found"})

        if(user) {
            const token=await jwt.sign({id:user._id},ACCESS_KEY,{expiresIn:"30m"})
           await sendVerfication(email,user._id,token);
            return res.status(200).json({"msg":"email sent succefully"})
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({"msg":"error occured at server"})
    }
})

router.post('/reset-password/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;
        
        try {
            const val = jwt.verify(token, ACCESS_KEY);
            // Token is valid
            const user = await UserModel.findById(id);
            if (!user) return res.status(400).json({"msg": "invalid user"});
            
            // Update password
            user.password = password;
            await user.save();
            return res.status(200).json({"msg": "reset successful"});
        } catch (error) {
            // Token is invalid or expired
            console.error(error);
            return res.status(400).json({"msg": "invalid token"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({"msg": "internal server error"});
    }
});


module.exports = {
    userRoutes:router,
};