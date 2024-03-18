const mongoose=require('mongoose');

//mongoose.set('strictQuery', true); 
const DB_URL=process.env.DB_URL;
const db_connect=async ()=>{
	console.log(DB_URL)
	try{
		await mongoose.connect(DB_URL);
		console.log("db connection established succesfully");
	}
	catch(err){
		console.log("err:"+err);
		console.log("db_not connected");
	}
}

module.exports=db_connect;