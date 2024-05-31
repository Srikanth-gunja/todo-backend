const mongoose=require('mongoose');

//mongoose.set('strictQuery', true); 
const DB_URL=process.env.DB_URL;
//const DB_URL="mongodb+srv://chintu:chintu@cluster0.zad1igq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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