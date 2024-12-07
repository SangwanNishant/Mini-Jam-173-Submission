const express = require("express");
const path = require("path");
const app = express()
const PORT = 3050


app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "menu.html"))
})

app.get('/game', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "game.html"))
})

app.get('/difficulty', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "difficulty.html"))
})

app.get('/game-easy', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "game-easy.html"))
})

app.get('/game-medium', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "game-medium.html"))
})

app.get('/game-hard', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "game-hard.html"))
})

app.listen(PORT,()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
})