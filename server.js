const express=require("express");
const cors=require("cors");
const {userRoutes} = require("./routes/userRoutes");
const todoRoutes=require('./routes/todoRoutes')
require("dotenv").config();
const db_connect=require("./db_connection/db_connection.js")
//const verifier= new(require('email-verifier'))


const app=express();
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT || 9000;

db_connect();
/*
const test="srikanthgunja25@gmail.com";
verifier.verify(test,(err,data)=>{
	if(err){
		console.log("error occured");
	}
	else{
		if(data.format_valid&& data.mx_found &&data.smtp_check){
			console.log("vaild email");
		}
		else{
			console.log("error insside")
		}
	}
});
*/
app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);


app.listen(PORT,()=>console.log(`server listening on ${PORT}`))