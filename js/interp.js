// Fastrack interpreter
// No multi-track drifting allowed

//helper fn
function sleep(ms) {
  return ;
}

class Interpreter {

    constructor(code, input) {
        this.code = []
        this.grid = []

        this.input = input // must be an array of bits
    }

    parse(value) {
        this.code = value.split`
`

        // first three lines are train data, input and output, in that order.
        // train data is [x,y,dx,dy]
        // input and output points are given as x,y pairs. They must be lazy points.
        // may add a flag later to accomodate string input converted to a byte stream.
        try {
            this.tD = JSON.parse(this.code[0])
            this.iP = JSON.parse(this.code[1]).map(x=>x.reverse())
            this.oP = JSON.parse(this.code[2]).map(x=>x.reverse())
        } catch (e) {
            console.log("input/output invalid")
            return
        }

        [this.tC,this.tR,this.dC,this.dR] = this.tD

        // Pad each line to the next multiple of 3
        let lAL = Math.max(...this.code.slice(2).map(x=>x.length)) + 3 - 1

        // Make rows of chars
        this.grid = this.code.slice(3).map(l => Array.from(l.padEnd(lAL - l.length, " ")))

        // old chunking code
        // for (let row = 0; row < rowChunks.length / 3; row += 1) {
        //     for (let column = 0; column < rowChunks[row].length; column += 1) {
        //         let gr=this.grid[[row, column]] = [0, 1, 2]
        //             .map(i => rowChunks[3 * row + i])
        //             .map(chunk => chunk ? chunk[column] : "...")
        //             .map(str => Array.from(str))
        //         if(gr[1][1] === "T"){
        //             this.tRow = row
        //             this.tCol = column
        //         }
        //         for(let iR=0;iR<3;iR++) {
        //             for(let iC=0; iC<3;iC++){
        //                 if(1+"><^v".indexOf(gr[iR][iC])){
        //                     this.dRow = iR - 1
        //                     this.dCol = iC - 1
        //                 }
        //             }
        //         }
        //     }
        // }
        if(!this.tD)console.log("No train given")

        console.log(this.tRow,this.tCol)
        console.log(this.dRow,this.dCol)
        console.log(this.grid)
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
        Connections:
        Taken in NSEW format as [0,1,2,3]?
        or possibly, as an object.
    */
    step(display) { // Main stepping function

        display.innerText = this.grid.map(x=>x.join('')).join`
`

        this.grid[this.tR][this.tC] = '#'
        this.tR += this.dR
        this.tC += this.dC
        this.grid[this.tR][this.tC] = 'T'
        console.log(this.tR,this.tC,this.dR,this.dC)

        let vn = [[0,1],[1,0],[0,-1],[-1,0]].filter(d=>d!=[-this.dR,-this.dC].toString())
        let ps = vn.filter(d=>'#' == (this.grid[this.tR+d[0]]||[])[this.tC+d[1]])


        if(ps) {
            [this.dR,this.dC] = ps[0]
        } else if('P' == this.grid[this.tR+this.dR][this.tC+this.dC]){
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

    async run(display) {
        while(this.step(display))await new Promise(resolve => setTimeout(resolve, 500))
    }
}

let interp = new Interpreter()
