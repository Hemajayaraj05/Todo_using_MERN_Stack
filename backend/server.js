const express=require('express');
const mongoose=require('mongoose');
const app=express();

const cors = require('cors');
app.use(cors());
app.use(express.json())
// let todos=[];

mongoose.connect('mongodb://localhost:27017/mern-stack-todo')
.then(()=>{
    console.log("DB connected!");
})
.catch((err)=>
{
    console.log(err);
})


const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    }
})

const todoModel=mongoose.model('Todo',todoSchema);

//creating todo item
app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
    // const newTodo={
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(newTodo);
    try{
        const newTodo=new todoModel({title,description})
        await newTodo.save();
        res.status(201).json(newTodo);
    }
  catch(err){
        console.log(err);
        res.status(500).json({message:errr.message}); 
    }
    

})



//getting the items
app.get('/todos',async(req,res)=>{
    try{
        const todos=await todoModel.find();
        res.json(todos);
    }
    catch{
        console.log(err);
        res.status(500).json({message:errr.message}); 
    }
    
})



//updating item
app.put('/todos/:id',async(req,res)=>{
    try{

        const {title,description}=req.body;
        const id=req.params.id;
        const updatedTodo=await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true} 
        )
        if(!updatedTodo)
        {
            return res.send(404).json({message:"Todo not found"});
        }
        res.json(updatedTodo);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:err.message}); 

    }

})



//deleting item
app.delete('/todos/:id',async(req,res)=>{
    try{

        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message}); 
    }
})





app.listen(3000,()=>{
    console.log("Server listening to the port 3000")
});
