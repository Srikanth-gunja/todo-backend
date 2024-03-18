const mongoose=require('mongoose');

const DB_URL=process.env.DB_URL;
const db_connect=async ()=>{
	try{
		await mongoose.connect(DB_URL);
		console.log("db connection established succesfully");
	}
	catch(err){
		console.log("db_not connected");
	}
}

module.exports=db_connect;