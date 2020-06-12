const socket = io("http://localhost:8000");

//get dom elements in respective js variables
const form = document.getElementById("send-container");

const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");


// audio that will play on 2 cases user join and user sends a message

var audio = new Audio('message.mp3');
var new_user = new Audio("new.mp3");

// function which will append event info to  the container

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
  if (position == "center") {
    new_user.play();
  }
};

// ask new user his name and let server know

const name = prompt("enter your name to join");
socket.emit("new-user-joined", name);

//append mesages to container

//if new user joins receive event from server

socket.on("user-joined", (name) => {
  append(`${name} joined the chat!`, "center");
});

//if server sends a message receive it

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// if a user leaves te chat append the info to the container

socket.on("left", (name) => {
  append(`${name} left the chat`, "center");
});

//if the form gets submitted send server the message

form.addEventListener("submit", (e) => {

    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });