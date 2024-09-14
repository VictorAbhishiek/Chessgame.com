const express = require('express');
const socket = require('socket.io');
const http = require('http');
const {Chess} = require('chess.js');
const path = require('path');


const app = express(); // Chess rules engine

//create the link between express and http server
const server = http.createServer(app); 
const io = socket(server);  

const chess = new Chess(); // This lines Chess() function tells about the chess overall rules 
let players = {};
let currentPlayer = "w"; // White player starts

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//Home page
app.get("/", (req, res) =>{
    res.render("index");
});

// Socket.io connection
io.on("connection", function(uniqueSocket){
    console.log("connected");
     // Assign player roles (white, black, or spectator)
    if(!players.white){ 
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w"); // corrected event name to match chessgame.js
        
    }else if(!players.black){
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b"); // corrected event name to match chessgame.js
    }else{
        uniqueSocket.emit("spectatorRole"); // corrected event name to match chessgame.js
    }
    
    // Handle player disconnection
    uniqueSocket.on("disconnect", function(){
        if(uniqueSocket.id === players.white){
            delete players.white;
        }else if(uniqueSocket.id === players.black){
            delete players.black;
        }
        console.log("Disconnected");
    });

    // Handle move made by player
    uniqueSocket.on("move", (move) => {
        try{
            if(chess.turn() === "w" && uniqueSocket.id !== players.white) return;
            if(chess.turn() === "b" && uniqueSocket.id !== players.black) return;

            const result = chess.move(move); //Attempt to make move
            if(result){
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen()); // Send updated board to all players
            }else{
                console.log("Invalid Move: ", move);
                uniqueSocket.emit("Invalid Move", move);
            }
        } catch(err){
            console.log(err);
            console.log("Invalid Move: ", move);
        }
    })
});


server.listen(3000);