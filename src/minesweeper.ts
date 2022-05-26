export default class Minesweeper {

    gameField: string[][];
    displayField: string[][];
    gameOver: boolean;
    mines: number;
    boardSize: number[];

    constructor(boardSize: [number, number] = [9, 9],
                mineRatio: number = 12) {

        let x: number = boardSize[0];
        let y: number = boardSize[1];

        this.gameField = new Array();
        this.displayField = new Array();
        this.gameOver = false;
        this.boardSize = boardSize;
        

        for (let i = 0; i < x; i++) {
            this.gameField.push([])
            this.displayField.push([])

            for (let j = 0; j < y; j++) {
                this.gameField[i].push("")
                this.displayField[i].push("")
            }
            
        }

        this.mines = Math.round(this.fieldCount() * (mineRatio/100));
        this.placeMines();
        this.placeNumbers();
    }

    checkWinCondition() {
        let flagCoords = [];
        let bombCoords = [];

        for (const x in this.displayField) {
            for (const y in this.displayField[x]) {
                if (this.displayField[x][y] === "!") {
                    flagCoords.push([x, y]);
                }
                if (this.gameField[x][y] === "*") {
                    bombCoords.push([x, y]);
                }
            }
            
        }

        
        if (JSON.stringify(flagCoords) ===  JSON.stringify(bombCoords)) {
            this.gameOver = true;
            alert("You won!");
            return true;
        }
            
        return false;

    }

    uncoverSurroundingFields(x: number, y: number) {
        this.displayField[x][y] = this.gameField[x][y]
        const directions = [
            [1, 1], [1, 0], [1, -1],
            [0, 1], [0, 0], [0, -1],
            [-1, 1], [-1, 0], [-1, -1],
        ]

        for (const direction of directions) {
            
            const cx = x + direction[0]
            const cy = y + direction[1]
            //check if not out of bounds
            if (cy >= 0 && cy < this.boardSize[1]) {
                if (cx >= 0 && cx < this.boardSize[0]) {
                    
                    if (this.gameField[cx][cy] !== (0).toString())
                        this.displayField[cx][cy] = this.gameField[cx][cy]

                }
            }
        }
    }

    stepOn(x: number, y: number, flag = false) {

        if (this.gameOver) {
            if (this.checkWinCondition()) {
                alert("You won!");
            } else {
                alert("Game Over! You've stepped on a mine.");
            }
        } else if (flag && this.displayField[x][y] === "") {
            //check if flagging - if already flagged, remove
            this.displayField[x][y] = (this.displayField[x][y] === "" ? "!" : "");
        } else {
            if (this.displayField[x][y] === "") {
                const steppedOn = this.gameField[x][y];
                switch (steppedOn) {
                    case "*":
                        this.displayField[x][y] = steppedOn;
                        alert("Game Over. You have stepped on a mine.");
                        this.gameOver = true;
                        //stepped on mine
                        break;
                    case "0":
                        this.uncoverSurroundingFields(x, y);
                        this.stepOnSurroundingZeroes(x, y);
                        break;
                    default:
                        this.displayField[x][y] = steppedOn;
                        console.log(steppedOn);
                        break;
                }
            }
        }
        

    }

    stepOnSurroundingZeroes(x: number, y: number) {
        

        const directions = [
            [1, 1], [1, 0], [1, -1],
            [0, 1], [0, 0], [0, -1],
            [-1, 1], [-1, 0], [-1, -1],
        ]

        for (const direction of directions) {
            
            const cx = x + direction[0]
            const cy = y + direction[1]
            //check if not out of bounds
            if (cy >= 0 && cy < this.boardSize[1]) {
                if (cx >= 0 && cx < this.boardSize[0]) {
                    
                    

                    if (this.gameField[cx][cy] === (0).toString() && this.displayField[cx][cy] === ""){
                        this.displayField[x][y] = this.gameField[x][y]
                        this.stepOnSurroundingZeroes(cx, cy)
                        this.uncoverSurroundingFields(x, y)
                        
                    }
                    
                }
            }
        }
    }

    placeMines() {
        console.log("placeMines()", this.gameField);

        //loop through as many times as there are bombs
        for (let i = 0; i < this.mines; i++) {

            //generate random numbers, to decide, where to put the next bomb
            let x = Math.floor(Math.random() * this.boardSize[0]);
            let y = Math.floor(Math.random() * this.boardSize[1]);
            
            //check if the field is occupied
            if (this.gameField[x][y] !== "*") {
                this.gameField[x][y] = "*" //places bomb
                console.log("gameFieldxy",this.gameField[x][y]);

            } else {
                
                //if the field is occupied, search for another free space nearby
                while (this.gameField[x][y] === "*") {
                    console.log("placeMines()", this.gameField);
                    //randomize, in which direction we should look for a new field
                    if (Math.floor(Math.random() * 2) === 0) {
                        x++;

                        //if place would exceed the size, reset it
                        if (x >= this.boardSize[0]) {
                            x = 0;
                        }
                        
                    } else {
                        y++;

                        //if place would exceed the size, reset it
                        if (y >= this.boardSize[1]) {
                            y = 0;
                        }
                    }
                    
                }
                
                this.gameField[x][y] = "*"; //places bomb
            }
            
        }
    }

    placeNumbers() {
        let surroundingMines = (x: number, y: number) => {
            let mineCount = 0;
            
            //define all directions in a 3x3 matrix
            const directions = [
                [1, 1], [1, 0], [1, -1],
                [0, 1], [0, 0], [0, -1],
                [-1, 1], [-1, 0], [-1, -1],
            ];

            //check for every direction
            for (const direction of directions) {

                const cx = x + direction[0];
                const cy = y + direction[1];
                //check if not out of bounds
                if (cy >= 0 && cy < this.boardSize[1]) {
                    if (cx >= 0 && cx < this.boardSize[0]) {
                        
                        if (this.gameField[cx][cy] === "*")
                        mineCount++;
                    }
                }
            }
            
            return mineCount.toString()
        }

        //go through the board
        for (let i = 0; i < this.boardSize[0]; i++) {
            for (let j = 0; j < this.boardSize[1]; j++) {
                //if the field is not a minefield, calculate the surrounding mines
                if (this.gameField[i][j] !== "*") {
                    this.gameField[i][j] = surroundingMines(i, j);
                    
                }
                
            }
            
        }
    } 

    fieldCount() {

        let size = 0;
        for (let i = 0; i < this.gameField.length; i++) {
            size += this.gameField[i].length;
        }

        return size;
    }
}