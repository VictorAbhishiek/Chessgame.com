# Chessgame.com
A real-time, web-based chess game built with Node.js, Express, Socket.io, and EJS. This project allows two players to play chess in real-time with proper handling of piece movement, validation of legal moves, and board flipping for the black player.

# Features
Real-time chess gameplay with two players using Socket.io
Chess rules validation with the Chess.js library
Board flipping for the black player
Spectator mode for additional connections
Drag-and-drop piece movement
Fully responsive design using Tailwind CSS

Installation
To get this project running locally, follow these steps:
# Clone the repository:
  git clone https://github.com/VictorAbhishiek/chessgame.com.git
  cd chess
# Install dependencies: Make sure you have Node.js installed. Then, run:
  npm install
# Start the server: Once all dependencies are installed, start the server with:
  npm start
# Access the game: Open your browser and navigate to:
  http://localhost:3000/

# Usage
  Player 1 (white) connects first, and Player 2 (black) connects second.
  Use drag-and-drop to move the pieces.
  The board will automatically flip for Player 2 (black).
  Invalid moves will be blocked.
  Additional users can join as spectators.

# Folder Structure
  chess-game/
│
├── public/               # Static files (CSS, JS)
├── views/                # EJS templates
│   └── index.ejs         # Main game page
├── js/
│   └── chessgame.js      # Client-side game logic
├── app.js                # Server-side logic
├── package.json          # Project dependencies and scripts
└── README.md             # Project overview

# Project Files
  # app.js:
      Handles server-side logic, player assignment, socket connections, and move validation using the Chess.js library.
  # chessgame.js:
     Implements the front-end chessboard rendering, drag-and-drop movement, and communication with the server via Socket.io.
  # index.ejs:
      The HTML template rendered by Express. Contains the chessboard layout and includes the necessary scripts and styles for the game.
  
# Technologies Used
Node.js: Backend runtime for running the server
Express.js: Framework for handling routes and rendering the front-end
Socket.io: Real-time bi-directional communication between clients and the server
Chess.js: Library for handling the rules and logic of the chess game
EJS: Template engine for rendering the front-end
Tailwind CSS: Utility-first CSS framework for styling the chessboard
