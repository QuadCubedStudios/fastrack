// Fastrack interpreter
// No multi-track drifting allowed

class SparseMatrix {
    constructor() {
        this.data = {};
        this.rowIndices = new Set();
        this.colIndices = new Set();
    }

    set([row, col], value) {
        this.data[[row, col]] = value;
        this.rowIndices.add(row);
        this.colIndices.add(col);
    }

    get([row, col]) {
        return this.data[[row, col]];
    }

    *[Symbol.iterator]() {
        for (const row of this.rowIndices) {
            for (const col of this.colIndices) {
                yield [row, col, this.data[[row, col]]];
            }
        }
    }
}

class Interpreter {
    constructor() {
        this.grid = new SparseMatrix();
        this.registers = {};
    }

    parse(value, trainData) {
        this.grid = new SparseMatrix();
        let code = value.split('\n')

        document.querySelector("#display").innerHTML = "";
        for (let row = 0; row < code.length; row += 1) {
            for (let col = 0; col < code[row].length; col += 1) {
                let currentTile = code[row][col];
                switch (currentTile) {
                    case " ":
                        continue;
                    default:
                        this.grid.set(row, col, currentTile);
                        break;
                }
                let el = document.createElement("div");
                el.innerText = currentTile;
                el.classList.add("piece");
                el.style.top = `${row * 16}px`;
                el.style.left = `${col * 16}px`;

                document.querySelector("#display").appendChild(el);
            }
        }

        // first three lines are train data, input and output, in that order.
        // train data is [x,y,dx,dy]
        // input and output points are given as x,y pairs. They must be lazy points.
        // may add a flag later to accomodate string input converted to a byte stream.
        try {
            trainData = JSON.parse(trainData)
            // TODO:
            // this.iP = JSON.parse(this.code[1]).map(x=>x.reverse()) // input points
            // this.pP = JSON.parse(this.code[2]).map(x=>[x[1],x[0],x[2]]) // preset points
            // this.oP = JSON.parse(this.code[3]).map(x=>x.reverse()) // output points

            this.trainCurrentPositon = [trainData[0], trainData[1]];
            this.trainDelta = [trainData[2], trainData[3]];
            // [this.tC,this.tR,this.dC,this.dR] = trainData
    
            // Pad each line to hte longest length
            // let lAL = Math.max(...this.code.slice(2).map(x=>x.length))
    
            // Make rows of chars
            // this.grid = this.code.slice(3).map(l => Array.from(l.padEnd(lAL - l.length, " ")))
            // if(!this.tD)console.log("No train given")
    
            console.log(this.tRow,this.tCol)
            console.log(this.dRow,this.dCol)
            console.log(this.grid)
        } catch (e) {
            console.log("input/output invalid")
            console.error(e);
            return
        }
    }

    /*
        Track specification:
        Track symbol: '#'
        Train symbol: 'T'
    */
    step(display) { // Main stepping function
        // const g = JSON.parse(JSON.stringify(this.grid))
        // g.set(this.tR, this.tC, ) = '<span style="color:red">T</span>';
        // display.innerHTML = g.map(x=>x.join('')).join('\n').replace(/([PS])/g,'<span class="$1color">$1</span>')

        this.trainPreviousPosition = this.trainCurrentPositon;

        this.trainCurrentPositon[0] += this.trainDelta[0];
        this.trainCurrentPositon[1] += this.trainDelta[1];
        // console.log(this.tR,this.tC,this.dR,this.dC)

        let vonNeumann = [[0,1],[1,0],[0,-1],[-1,0]].map(direction => {
            let position = [
                this.trainCurrentPositon[0] + direction[0],
                this.trainCurrentPositon[1] + direction[1],
            ];

            return [
                direction,
                this.grid.get(position)
            ];
        }).filter(([_, tile]) => !!tile); //.filter(d => d != [-this.dR,-this.dC].toString())

        let currentTile = this.grid.get(this.trainCurrentPositon);

        if (!['#', 'S', '0', '1'].includes(currentTile)) {
            // Lazy Switch
            // TODO: Check previous tile, assign value to switch register bit
        } else {
            // Normal track
            // Straight ahead
            if (this.grid.get()) {

            }
        }

        let trackPositions = vonNeumann.filter(([_, tile]) => ['#', '0', '1'].includes(tile));
        let sprungSwitches = vonNeumann.filter(([_, tile]) => tile === 'S');
        let sw = vonNeumann.filter(d=>'P' == (this.grid[this.tR+d[0]]||[])[this.tC+d[1]])

        if(ss[0] && ss[0] != [-this.dR,-this.dC]){
            [this.dR,this.dC] = ss[0]
        } else if(trackPositions[0]) {
            [this.dR,this.dC] = trackPositions[0]
        } else if(sw[0]){
            [this.dR,this.dC] = sw[0]
            this.grid[this.tR+this.dR][this.tC+this.dC] = '#'
            this.grid[this.tR+2*this.dR][this.tC+2*this.dC] = 'P'
        } else {
            return 0 // stop on a falsy value
        }

        console.log(this.grid)
        if(this.tR == this.tD[1] && this.tC == this.tD[0]){
            return 0 // end at original position
        }
        return this.grid
    }

    async run(display, output) {
        while(this.step(display))await new Promise(resolve => setTimeout(resolve, 500)) // JS's awful hack of a delaying method.

        let aPs = {} // all point data
        for(let i=0; i<this.iP.length; i++) {
            let [r,c] = this.iP[i]
            let b = this.input[i]
            aPs[this.iP[i]] = this.grid[r][c] == 'P' ? b : !b
        }

        for(let i=0; i<this.pP.length; i++) {
            let [r,c,b] = this.pP[i]
            aPs[this.pP[i].slice(0,2)] = this.grid[r][c] == 'P' ? b : !b
        }

        output.innerText = this.oP.map(x => +aPs[x]).join``
    }
}

let interp = new Interpreter();
