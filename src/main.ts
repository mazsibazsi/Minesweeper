import './style.css'
import Minesweeper from './minesweeper.js'

let game = new Minesweeper();

document.addEventListener("DOMContentLoaded", () => {
  let boardSize = "16x16".split("x");
  let mineRatio = 12;
  let startButton = document.getElementById("start-button");

  startButton!.addEventListener("click", () => {
    boardSize = (document.getElementById("board-size")! as HTMLInputElement).value.split("x");
    mineRatio = parseInt((document.getElementById("mine-ratio")! as HTMLInputElement).value);
    game = new Minesweeper ( [parseInt(boardSize[0]), parseInt(boardSize[1])], mineRatio);
    console.log(mineRatio);
    console.log(game);

    drawGame();
  })

  drawGame();
})

function drawGame() {
  //select the gameArea, and put a table in it
  const gameArea = document.getElementById("game-area")!;
  gameArea.innerHTML = ""; //clear all
  const gameDisplay = document.createElement("table")!;

  gameArea.appendChild(gameDisplay);

  for (let x = 0; x < game.boardSize[0]; x++) {
      const row = document.createElement('tr');


      for (let y = 0; y < game.boardSize[1]; y++) {
          
          const col = document.createElement('td');
          const div = document.createElement("div");
          const button = document.createElement("button");
           

          button.addEventListener("mousedown", (event) => {
              if (event.button === 0)
                  game.stepOn(x, y);
              else
                  game.stepOn(x, y, true);
              game.checkWinCondition();
              drawGame();
          })

          //prevent context menu opening on rightclick, as we use it for flagging
          button.addEventListener("contextmenu", (event) => {
              event.preventDefault();
          })
          
          button.innerText = numberToEmoji[game.displayField[x][y] as keyof typeof numberToEmoji];
          button.setAttribute("style", "background-color:" + getColor[game.displayField[x][y] as keyof typeof getColor] + ";");
          //console.log("button", button)
          div.appendChild(button);
          col.appendChild(div);
          row.appendChild(col);
      }
      gameDisplay.appendChild(row);
      
  }
  
}

const numberToEmoji = {
  "": "",
  "0": "",
  "1": "1️",
  "2": "2️",
  "3": "3️",
  "4": "4️",
  "5": "5️",
  "6": "6️",
  "7": "7️",
  "8": "8️",
  "*": "💣",
  "!": "🚩",
};

const getColor = {
  "": "lightgray",
  "0": "",
  "1": "#97b1e3",
  "2": "#85d37e",
  "3": "#ff7e0f",
  "4": "#bea3d9",
  "5": "#d80000",
  "6": "#52c6d7",
  "7": "#a753c3",
  "8": "#000000",
  "*": "white",
  "!": "#d3d3d3",
};