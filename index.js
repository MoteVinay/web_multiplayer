//server is changed ...
const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const ejsMate = require("ejs-mate");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const mongoURI = "mongodb://localhost:27017/gamingProject";
const bodyParser = require("body-parser");
const staticRouter = require("./routers/staticRouter");
const user = require("./routers/user");
const Winner = require("./models/winners");
const game = require("./models/game");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public/views/"));

app.use("/", staticRouter);
app.use("/user", user);

app.use(express.static(path.join(__dirname, "./public/assets/")));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

let rooms = [];

io.on("connection", (socket) => {
  io.to(socket.id).emit("connected", { id: socket.id });
  socket.on("tryconnecting", (data) => {
    let room;
    if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1) {
      let neededId = rooms.findIndex((room) => {
        return room.players.some((player) => player.roomKey === data.roomKey);
      });

      if (neededId !== -1) {
        room = rooms[rooms.length - 1];
      } else {
        io.to(data.id).emit("wrongKey");
        console.log("invalid");
        return;
      }
    }

    if (room) {
      socket.join(room.id);
      socket.emit("playerNo", 2);

      // add player to room
      room.players.push({
        socketId: data.id,
        roomKey: data.roomKey,
        name: data.name,
        playerNo: 2,
        score: 0,
        move: "O",
      });

      // insert into game collection
      addGame("tictactoe", room.players[0].name, room.players[1].name);
      console.log(room);

      // send message to room
      io.to(room.id).emit("startingGame", room.players);

      setTimeout(() => {
        io.to(room.id).emit("buttonCtrl", room);
      }, 1000);
    } else {
      room = {
        id: rooms.length + 1,
        players: [
          {
            socketId: data.id,
            roomKey: data.roomKey,
            name: data.name,
            playerNo: 1,
            score: 0,
            move: "X",
          },
        ],
        winner: "",
        toMove: "X",
        sum: 1,
      };
      rooms.push(room);
      socket.join(room.id);
      socket.emit("playerNo", 1);
    }
  });

  socket.on("playing", (data) => {
    let room = rooms.find((r) => r.id == data.id);
    let toSocket = room.players.find((r) => r.socketId !== data.socket);
    room.sum++;
    if (data.value == "X") {
      room.toMove = "O";
    } else {
      room.toMove = "X";
    }
    io.to(room.id).emit("updateBtn", data);
    // setInterval(() => {
    io.to(room.id).emit("buttonCtrl", room);
    // }, 100);
    // setInterval(() => {
    io.to(room.id).emit("checkWinner", room);
    // }, 2000);
  });

  socket.on("gameOver", (room) => {
    if (room.winner !== "") {
      console.log(room.winner);
      const looserName = room.players.find(
        (player) => player.name !== room.winner
      ).name;
      const newWinner = new Winner({
        gameName: "Tictactoe",
        winner: room.winner,
        otherPlayer: looserName,
        timeWhenPlayed: new Date(),
      });
      newWinner
        .save()
        .then((result) => {
          console.log("Document inserted successfully:", result);
        })
        .catch((error) => {
          console.error("Error inserting document:", error);
        });
      console.log(room);
    }
  });
});

let Prooms = [];
//** Start of ping pong **/

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (user) => {
    // console.log(Prooms[0].players);

    // get Proom
    let Proom;
    if (Prooms.length > 0 && Prooms[Prooms.length - 1].players.length === 1) {
      Proom = Prooms[Prooms.length - 1];
    }

    if (Proom) {
      socket.join(Proom.id);
      socket.emit("playerNo", 2);

      // add player to Proom
      Proom.players.push({
        user_id: user.userName,
        socketID: socket.id,
        playerNo: 2,
        score: 0,
        x: 690,
        y: 200,
      });
      console.log(Prooms[0].players);

      // insert into game collection
      addGame("Pingpong", Proom.players[0].user_id, Proom.players[1].user_id);

      // send message to Proom
      io.to(Proom.id).emit("startingGame");

      setTimeout(() => {
        io.to(Proom.id).emit("startedGame", Proom);

        // start game
        startGame(Proom);
      }, 3000);
    } else {
      Proom = {
        id: Prooms.length + 1,
        players: [
          {
            user_id: user.userName,
            socketID: socket.id,
            playerNo: 1,
            score: 0,
            x: 90,
            y: 200,
          },
        ],
        ball: {
          x: 395,
          y: 245,
          dx: Math.random() < 0.5 ? 1 : -1,
          dy: 0,
        },
        winner: 0,
      };
      Prooms.push(Proom);
      socket.join(Proom.id);
      socket.emit("playerNo", 1);
    }
  });

  socket.on("move", (data) => {
    let Proom = Prooms.find((Proom) => Proom.id === data.roomID);

    if (Proom) {
      if (data.direction === "up") {
        Proom.players[data.playerNo - 1].y -= 10;

        if (Proom.players[data.playerNo - 1].y < 0) {
          Proom.players[data.playerNo - 1].y = 0;
        }
      } else if (data.direction === "down") {
        Proom.players[data.playerNo - 1].y += 10;

        if (Proom.players[data.playerNo - 1].y > 440) {
          Proom.players[data.playerNo - 1].y = 440;
        }
      }
    }

    // update Prooms
    Prooms = Prooms.map((r) => {
      if (r.id === Proom.id) {
        return Proom;
      } else {
        return r;
      }
    });

    io.to(Proom.id).emit("updateGame", Proom);
  });

  socket.on("leave", (roomID) => {
    socket.leave(roomID);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

function startGame(Proom) {
  let Pinterval = setInterval(() => {
    Proom.ball.x += Proom.ball.dx * 5;
    Proom.ball.y += Proom.ball.dy * 5;

    // check if ball hits player 1
    if (
      Proom.ball.x < 110 &&
      Proom.ball.y > Proom.players[0].y &&
      Proom.ball.y < Proom.players[0].y + 60
    ) {
      Proom.ball.dx = 1;

      // change ball direction
      if (Proom.ball.y < Proom.players[0].y + 30) {
        Proom.ball.dy = -1;
      } else if (Proom.ball.y > Proom.players[0].y + 30) {
        Proom.ball.dy = 1;
      } else {
        Proom.ball.dy = 0;
      }
    }

    // check if ball hits player 2
    if (
      Proom.ball.x > 690 &&
      Proom.ball.y > Proom.players[1].y &&
      Proom.ball.y < Proom.players[1].y + 60
    ) {
      Proom.ball.dx = -1;

      // change ball direction
      if (Proom.ball.y < Proom.players[1].y + 30) {
        Proom.ball.dy = -1;
      } else if (Proom.ball.y > Proom.players[1].y + 30) {
        Proom.ball.dy = 1;
      } else {
        Proom.ball.dy = 0;
      }
    }

    // up and down walls
    if (Proom.ball.y < 5 || Proom.ball.y > 490) {
      Proom.ball.dy *= -1;
    }

    // left and right walls
    if (Proom.ball.x < 5) {
      Proom.players[1].score += 1;
      Proom.ball.x = 395;
      Proom.ball.y = 245;
      Proom.ball.dx = 1;
      Proom.ball.dy = 0;
    }

    if (Proom.ball.x > 795) {
      Proom.players[0].score += 1;
      Proom.ball.x = 395;
      Proom.ball.y = 245;
      Proom.ball.dx = -1;
      Proom.ball.dy = 0;
    }

    if (Proom.players[0].score === 10) {
      Proom.winner = 1;
      addWinner("PingPong", Proom.players[0].user_id, Proom.players[1].user_id);
      Prooms = Prooms.filter((r) => r.id !== Proom.id);
      io.to(Proom.id).emit("endGame", Proom);
      clearInterval(Pinterval);
    }

    if (Proom.players[1].score === 10) {
      Proom.winner = 2;
      Prooms = Prooms.filter((r) => r.id !== Proom.id);
      io.to(Proom.id).emit("endGame", Proom);
      clearInterval(Pinterval);
    }

    io.to(Proom.id).emit("updateGame", Proom);
  }, 1000 / 60);
}

// move to winners model and add game updating function also
function addWinner(game, winner, looser) {
  const newWinner = new Winner({
    gameName: game,
    winner: winner,
    otherPlayer: looser,
    timeWhenPlayed: new Date(),
  });
  newWinner
    .save()
    .then((result) => {
      console.log("Document inserted successfully:", result);
    })
    .catch((error) => {
      console.error("Error inserting document:", error);
    });
}

async function addGame(gameName, player1, player2) {
  try {
    const today = new Date();
    const players = [player1, player2];
    const newGame = new game({
      game: gameName,
      friends: players,
      date: today,
    });

    const savedGame = await newGame.save();

    return savedGame;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
}

server.listen(3000, function () {
  //server is replaced with app
  console.log("Server started on port 3000");
});
