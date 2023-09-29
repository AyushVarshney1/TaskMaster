require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 5000
const Todo = require('./models/todos')
const cors = require('cors')
const path = require('path')

const db = mongoose.connection 
mongoose.connect(process.env.DATABASE_URL)

db.once('open', ()=>{
    console.log('Database connected')
})
db.on('error', (error)=>{
    console.log(error)
})

app.use(express.static(path.resolve(__dirname, "..", './client/build')));
app.use(express.json())
app.use(cors())

app.get('/todos', async (req,res) =>{
    const todos = await Todo.find()
    res.status(200).json(todos)
})

app.get('/todos/important', async (req,res) =>{
    const todos = await Todo.find({important: {$eq: true}})
    res.status(200).json(todos)
})

app.get('/todos/unimportant', async (req,res) =>{
    const todos = await Todo.find({important: {$eq: false}})
    res.status(200).json(todos)
})

app.post('/todos/new', async (req,res)=>{
    const newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed
    })
    newTodo.save()
    res.status(201).json(newTodo)
})

app.patch('/todos/update/:id', async (req,res)=>{
    const id = req.params.id
    const updatedTodo= await Todo.findByIdAndUpdate(id, {
        text: req.body.text,
        completed: req.body.completed,
        important: req.body.important
    }, {new: true})
    res.status(200).json(updatedTodo)
})

app.delete('/todos/delete/:id', async (req,res)=>{
    const id = req.params.id
    const deletedTodo = await Todo.findByIdAndDelete(id)
    res.status(200).json(deletedTodo)
})

app.delete('/todos/delete', async(req,res)=>{
    await Todo.deleteMany()
    res.status(200).json({})
})

app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "..", './client/build', 'index.html'))
})

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`))