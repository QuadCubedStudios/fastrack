// Fastrack interpreter
// No multi-track drifting allowed

class Interpreter {
    constructor(code, input) {
        this.code = [];
        this.grid = {};
        this.input = input; // must be an array of bits
 
    }

    parse(value) {
        this.code = value.split`
`;

        // first two lines are input and output, in that order.
        // input and output points are given as x,y pairs. They must be lazy points.
        // may add a flag later to accomodate string input converted to a byte stream.
        // try {
        //     // the map converts to row, col pairs
        //     this.inputPts = JSON.parse(code[0]).map(x=>x.reverse());
        //     this.outputPts = JSON.parse(code[1]).map(x=>x.reverse());
        // } catch (e) {
        //     console.log("input/output invalid");
        // }

        // Pad each line to the next multiple of 3
        let largestLineLength = Math.max(...this.code.slice(2).map(x=>x.length));
        let lengthOfAllLines = largestLineLength + 3 - 1;
        lengthOfAllLines -= (lengthOfAllLines % 3);

        // Make 3x3 tiles
        let rowChunks = this.code.slice(2).map(line => line.padEnd(lengthOfAllLines - line.length, ".").match(/.{1,3}/g));

        for (let row = 0; row < rowChunks.length / 3; row += 1) {
            for (let column = 0; column < rowChunks[row].length; column += 1) {
                let gr=this.grid[[row, column]] = [0, 1, 2]
                    .map(i => rowChunks[3 * row + i])
                    .map(chunk => chunk ? chunk[column] : "...");
                if(gr[1][1] === "T"){
                    this.tRow = row;
                    this.tCol = column;
                }
                for(let iR=0;iR<3;iR++) {
                    for(let iC=0; iC<3;iC++){
                        if(1+"><^v".indexOf(gr[iR][iC])){
                            this.dRow = iR - 1;
                            this.dCol = iC - 1;
                        }
                    }
                }
            }
        }
        if(!this.tRow)console.log("No train given")
        if(!this.dRow)console.log("No train direction given")
        
        console.log(this.tRow,this.tCol)
        console.log(this.dRow,this.dCol)
        console.log(this.grid);
    }

    /*
        Track object specification:
        Track symbol: '#'
        Train symbol: 'T'
        Train direction: indicated by any of ^v<> on a space where a track would be.
        Type:
        - Normal(straight line or single turn)
        - Lazy Point(contains a '/' or '\\' at [1,1])
        - Sprung Point(contains one of '^v<>' at [1,1])
        Lazy points have a numeric value(default 0) set by the programmer, I think
        Connections:
        Taken in NSEW format as [0,1,2,3]?
        or possibly, as an object.
    */
    step() {
        // remove train from old position
        // let dGrid = this.grid
        // let tStr = this.grid[[this.tRow,this.tCol]][1]
        // dGrid[[this.tRow,this.tCol]][1] = tStr[0] + '#' + tStr[2]


        this.tRow += this.dRow
        this.tCol += this.dCol

        let cell = this.grid[[this.tRow,this.tCol]] 
        //find new delta
        let tdR = this.dRow
        let tdC = this.dCol
        switch(cell[1][1]){
        case '/':
            this.dRow = tdC
            this.dCol = tdR
            this.grid[[this.tRow,this.tCol]][1].replace('/','\\')
            break;
        case '\\':
            this.dRow = -tdC
            this.dCol = -tdR
            this.grid[[this.tRow,this.tCol]][1].replace('\\','/')
            break;
        case '^':


        }

        // add train in new position
        // let ntStr = dGrid[[this.tRow,this.tCol]][1]
        // dGrid[[this.tRow,this.tCol]][1] = tStr[0] + 'T' + tStr[2]

        // for (let i = 0; i < this.grid.length; i++) { // rows
        //     for (let j = 0; j < this.grid[0].length; j++) { // columns

        //     }
        console.log(this.grid);
        }
    }
}

window.interp = new Interpreter();
