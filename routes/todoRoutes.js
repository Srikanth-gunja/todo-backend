const express = require("express");
const router = express.Router();
const UserModel = require("../UserModel");
const middleware = require("../middleware/authMiddleware");
require("dotenv").config();
router.post("/", middleware, async (req, res) => {
   
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

});

router.get("/", middleware, async (req, res) => {
   
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
});

router.delete("/:id", middleware, async (req, res) => {
   
    try {
        const { id } = req.params;
        const todoId = id.toString();
        const userId = req.data.id; // Assuming req.data.id holds the user ID

       
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ "msg": "User not found" });
        }

       
        const todoIndex = user.posts.findIndex(post => post._id.toString() === todoId);
        if (todoIndex === -1) {
            return res.status(404).json({ "msg": "Todo not found" });
        }

     
        user.posts.splice(todoIndex, 1);
        await user.save();

        return res.status(200).json({ "msg": "Todo deleted successfully" });
    } catch (err) {
        console.error("Error occurred while deleting todo:", err);
        return res.status(500).json({ "msg": "Error occurred at server" });
    }
});

module.exports = router;
