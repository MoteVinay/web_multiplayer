//Client Side
document.getElementById("loading").style.display = "none";
document.getElementById("bigcont").style.display = "none";
document.getElementById("userCont").style.display = "none";
document.getElementById("oppNameCont").style.display = "none";
document.getElementById("valueCont").style.display = "none";
document.getElementById("whosTurn").style.display = "none";
let button = document.getElementById("find");
let oppName = document.getElementById("oppName");
let socketId, roomId;
let value = document.getElementById("value");

const socket = io();

socket.on("connected", (data) => {
  socketId = data.id;
  console.log(socketId);
});

//Get Username from local storage if it
button.addEventListener("click", function () {
  let roomId = document.getElementById("roomid").value;
  if (roomId == "" || roomId == null) {
    window.alert("Enter all details before proceding");
  } else {
    let data = { id: socketId, name: user.userName, roomKey: roomId };
    socket.emit("tryconnecting", data);
    document.getElementById("loading").style.display = "block";
    //disabling button
    button.disabled = true;
  }
});

//invalid roomId
socket.on("wrongKey", () => {
  button.disabled = false;
  document.getElementById("loading").style.display = "none";
  window.alert("Invalid Room ID");
  console.log("invalid");
});

socket.on("startingGame", (e) => {
  document.getElementById("userCont").style.display = "block";
  document.getElementById("oppNameCont").style.display = "block"; //oppName container
  document.getElementById("valueCont").style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("roomid").style.display = "none";
  document.getElementById("find").style.display = "none";
  document.getElementById("enterroomId").style.display = "none";
  document.getElementById("bigcont").style.display = "block";
  document.getElementById("whosTurn").style.display = "block";

  let index, oppIndex;
  if (e[0].socketId == socketId) {
    index = 0;
    oppIndex = 1;
  } else {
    index = 1;
    oppIndex = 0;
  }

  document.getElementById("userName").innerText = user.userName;
  document.getElementById("oppName").innerText = e[oppIndex].name;
  document.getElementById("value").innerText = e[index].move;
});

document.querySelectorAll(".btn").forEach((e) => {
  e.addEventListener("click", function () {
    let value = document.getElementById("value").innerHTML;
    e.innerText = value; // displaing in button
    console.log(oppName.innerText);
    let t = { value: value, id: roomId, button: e.id, socket: socketId };
    socket.emit("playing", t);
  });
});

socket.on("buttonCtrl", (e) => {
  document.getElementById("whosTurn").innerText = e.toMove + "'s Turn";
  document.querySelectorAll(".btn").forEach((b) => {
    roomId = e.id;
    // console.log(value.innerText + " " + e.toMove);
    if (value.innerText != e.toMove) {
      // console.log(1);
      b.disabled = true;
    } else if (value.innerText == e.toMove && b.innerText == "") {
      b.disabled = false;
    } else {
      b.disabled = true;
    }
  });
});

socket.on("updateBtn", (data) => {
  if (data.socket != socketId) {
    document.querySelectorAll(".btn").forEach((e) => {
      if (e.id == data.button) {
        e.innerText = data.value;
      }
    });
  }
});

socket.on("checkWinner", (room) => {
  check(document.getElementById("userName").innerText, room);
});

function check(name, room) {
  let sum = room.sum;
  document.getElementById("btn1").innerText == ""
    ? (b1 = "a")
    : (b1 = document.getElementById("btn1").innerText);
  document.getElementById("btn2").innerText == ""
    ? (b2 = "b")
    : (b2 = document.getElementById("btn2").innerText);
  document.getElementById("btn3").innerText == ""
    ? (b3 = "c")
    : (b3 = document.getElementById("btn3").innerText);
  document.getElementById("btn4").innerText == ""
    ? (b4 = "d")
    : (b4 = document.getElementById("btn4").innerText);
  document.getElementById("btn5").innerText == ""
    ? (b5 = "e")
    : (b5 = document.getElementById("btn5").innerText);
  document.getElementById("btn6").innerText == ""
    ? (b6 = "f")
    : (b6 = document.getElementById("btn6").innerText);
  document.getElementById("btn7").innerText == ""
    ? (b7 = "g")
    : (b7 = document.getElementById("btn7").innerText);
  document.getElementById("btn8").innerText == ""
    ? (b8 = "h")
    : (b8 = document.getElementById("btn8").innerText);
  document.getElementById("btn9").innerText == ""
    ? (b9 = "i")
    : (b9 = document.getElementById("btn9").innerText);

  if (
    (b1 == b2 && b2 == b3) ||
    (b4 == b5 && b5 == b6) ||
    (b7 == b8 && b8 == b9) ||
    (b1 == b4 && b4 == b7) ||
    (b2 == b5 && b5 == b8) ||
    (b3 == b6 && b6 == b9) ||
    (b1 == b5 && b5 == b9) ||
    (b3 == b5 && b5 == b7)
  ) {
    setTimeout(() => {
      const result =
        sum % 2 === 0
          ? confirm("X WON !! Do you want to play a new game?")
          : confirm("O WON !! Do you want to play a new game?");
      if (sum % 2 === 0) room.winner = room.players[0].name;
      else room.winner = room.players[1].name;
      // room.winner = name;
      socket.emit("gameOver", room);
      if (result) {
        // User clicked "OK", redirect to a new game
        window.location.href = "/user/tictactoe";
      } else {
        // User clicked "Cancel" or closed the dialog, you can handle this case as needed
        // For example, you might want to redirect them to another page or perform some other action
        window.location.href = "/user/dashboard";
      }
    }, 1000);
  } else if (sum == 10) {
    alert("DRAW!!");
    setTimeout(() => {
      window.location.href = "/user/dashboard";
    }, 1000);
  }
}
