const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const bcrypt=require("bcrypt");
const UserModel=require("./UserModel");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const app=express();
app.use(express.json());
app.use(cors());

const PORT=process.env.PORT || 9000;
const DB_URL=process.env.DB_URL;
const ACCESS_KEY=process.env.ACCESS_TOKEN;

const db_connect=async ()=>{
	try{
		await mongoose.connect(DB_URL);
		console.log("db connection established succesfully");
	}
	catch(err){
		console.log("db_not connected");
	}
}
db_connect();

const date=new Date();
const timeAndDate=date.getDate()+"/"+date.getMonth()+"/"+date.getYear()+"  " +date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
app.post("/register",async (req,res)=>{
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
})




app.post("/login",async (req,res)=>{
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
})


const middleware=async (req,res,next)=>{
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
}

app.post("/todo",middleware,async (req,res)=>{
	const {text}=req.body;
	try{
		const data=req.data.id;
		const user=await UserModel.findById(data)
		user.posts.push({text})
		await user.save()
		return res.status(200).json({"msg":"todo added succesfully"})
	}
	catch(err){
		return res.status(400).json({"msg":"error ocuured at server"})
	}
})


app.get("/todo",middleware,async (req,res)=>{
	const {text}=req.body;
	try{
		const data=req.data.id;
		const user=await UserModel.findById(data)
		const todos=await user.posts;
		return res.status(200).json(todos)
	}
	catch(err){
		return res.status(400).json({"msg":"error ocuured at server"})
	}
})

app.delete("/todo/:id",middleware,async (req,res)=>{
try {
        const { id } = req.params;
        const todoId = id.toString();
        const userId = req.data.id; // Assuming req.data.id holds the user ID

        // Find the user by ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ "msg": "User not found" });
        }

        // Check if the todo exists in the user's posts array
        const todoIndex = user.posts.findIndex(post => post._id.toString() === todoId);
        if (todoIndex === -1) {
            return res.status(404).json({ "msg": "Todo not found" });
        }

        // Remove the todo from the posts array
        user.posts.splice(todoIndex, 1);
        await user.save();

        return res.status(200).json({ "msg": "Todo deleted successfully" });
    } catch (err) {
        console.error("Error occurred while deleting todo:", err);
        return res.status(500).json({ "msg": "Error occurred at server" });
    }
})

app.listen(PORT,()=>console.log(`server listening on ${PORT}`))