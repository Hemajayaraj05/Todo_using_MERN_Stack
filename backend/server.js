const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern-stack-todo')
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: {
    required: true,
    type: String
  }
});

const todoModel = mongoose.model('Todo', todoSchema);

app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server listening to the port 3000");
});
