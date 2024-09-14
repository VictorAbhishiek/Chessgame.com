const socket = io(); // connects to backend
const chess = new Chess();
const boardElement = document.querySelector('.chessboard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () =>{
    const board = chess.board(); //Get board state
    boardElement.innerHTML = ""; // clear current board
    board.forEach((row, rowindex) =>{
        row.forEach((square, squareindex) =>{
            const squarElement = document.createElement("div");
            squarElement.classList.add(
               "square", (rowindex + squareindex) % 2 === 0 ? "Light" : "dark" //logic of setting light and dark with div by 2  
            );
            squarElement.dataset.row = rowindex;
            squarElement.dataset.col = squareindex;

            if(square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;  // Allow dragging only if it's player's turn

                pieceElement.addEventListener("dragstart", (e) =>{
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowindex, col: squareindex};
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", (e) =>{
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squarElement.appendChild(pieceElement);
            }
            squarElement.addEventListener("dragover", function(e){
                e.preventDefault();
            });
            squarElement.addEventListener("drop", function(e){
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row: parseInt(squarElement.dataset.row),
                        col: parseInt(squarElement.dataset.col),
                    };

                    handleMove(sourceSquare, targetSource);
                }
            });
             boardElement.appendChild(squarElement);
        });
    });
   if(playerRole === 'b'){
    boardElement.classList.add("flipped"); // Flip the board for black
   }else{
    boardElement.classList.remove("flipped");
   }
};


// Handle move from source to target square
const handleMove = (source, target) =>{
    console.log("source", source);
    console.log("target", target);
    const move ={
        from:`${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q', // Promote to queen if applicable
    };
    socket.emit("move", move); // Send move to server
};

// Map piece type to Unicode symbols
const getPieceUnicode = (piece) =>{
    const unicodePiece = {
        p:"♟",
        r:"♜",
        n:"♞",
        b:"♝",
        q:"♛",
        k:"♚",
        P:"♚",
        R:"♖",
        N:"♘",
        B:"♗",
        Q:"♕",
        K:"♔",
    };
    return unicodePiece[piece.type] || "";
};

// Listen for role assignment
socket.on("playerRole", function(role){
    playerRole = role;
    renderBoard(); // Render board after role assignment
});

// Listen for spectator role
socket.on("spectatorRole", function(){
    playerRole= null;
    renderBoard(); // Render board for spectator
});

// Listen for board state updates
socket.on("boardState", function(fen){
    chess.load(fen); // Load board state from FEN
    renderBoard();
});
// Listen for move updates
socket.on("move", function(move){
    chess.move(move); // Update board with move
    renderBoard();
});

renderBoard();