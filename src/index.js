import Game from "./game.js"
import Algorithms from "./algorithms.js"

////////////////////////
const express = require("express")
const app = express()

app.get("/", function(req, res) {
  res.send("Working!@#")
})

app.listen(process.env.PORT || 5000)




//////////////////////
let canvas = document.querySelector("#gameScreen");

let ctx = canvas.getContext("2d");

const FPS = 0.5;
const GAME_WIDTH = 1300;
const GAME_HEIGHT = 600;
const NODE_SIZE = 34 // radius of node

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx.font = '17px serif';

let game = new Game(GAME_WIDTH, GAME_HEIGHT, NODE_SIZE);

let algorithm = undefined
if(document.body.id === "bst") {
  algorithm = Algorithms.algos.bst
} else if(document.body.id === "maxHeap") {
  algorithm = Algorithms.algos.maxHeap
} else if(document.body.id === "minHeap") {
  algorithm = Algorithms.algos.minHeap
}

game.start(algorithm);

let lastTime = 0;

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;

  lastTime = timeStamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);

  game.draw(ctx);

  setTimeout(() => {
window.requestAnimationFrame(gameLoop);
  }, 1000 / FPS);
}

window.requestAnimationFrame(gameLoop);
