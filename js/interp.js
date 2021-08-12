// Fastrack interpreter
// No multi-track drifting allowed

class Interpreter {
    constructor() {
        this.code = []
        this.grid = []
        this.input = [] // must be an array of bits
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
            this.iP = JSON.parse(this.code[1]).map(x=>x.reverse()) // input points
            this.pP = JSON.parse(this.code[2]).map(x=>[x[1],x[0],x[2]]) // preset points
            this.oP = JSON.parse(this.code[3]).map(x=>x.reverse()) // output points
        } catch (e) {
            console.log("input/output invalid")
            return
        }

        [this.tC,this.tR,this.dC,this.dR] = this.tD

        // Pad each line to hte longest length
        let lAL = Math.max(...this.code.slice(2).map(x=>x.length))

        // Make rows of chars
        this.grid = this.code.slice(3).map(l => Array.from(l.padEnd(lAL - l.length, " ")))
        if(!this.tD)console.log("No train given")

        console.log(this.tRow,this.tCol)
        console.log(this.dRow,this.dCol)
        console.log(this.grid)
    }

    /*
        Track specification:
        Track symbol: '#'
        Train symbol: 'T'
    */
    step(display) { // Main stepping function
        const g = JSON.parse(JSON.stringify(this.grid))
        g[this.tR][this.tC] = '<span style="color:red">T</span>';
        display.innerHTML = g.map(x=>x.join``).join`
`.replace(/([PS])/g,'<span class="$1color">$1</span>')

        this.tR += this.dR
        this.tC += this.dC
        console.log(this.tR,this.tC,this.dR,this.dC)

        let vn = [[0,1],[1,0],[0,-1],[-1,0]].filter(d=>d!=[-this.dR,-this.dC].toString())
        let ps = vn.filter(d=>'#' == (this.grid[this.tR+d[0]]||[])[this.tC+d[1]])
        let ss = vn.filter(d=>'S' == (this.grid[this.tR+d[0]]||[])[this.tC+d[1]])
        let sw = vn.filter(d=>'P' == (this.grid[this.tR+d[0]]||[])[this.tC+d[1]])

        if(ss[0] && ss[0] != [-this.dR,-this.dC]){
            [this.dR,this.dC] = ss[0]
        } else if(ps[0]) {
            [this.dR,this.dC] = ps[0]
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

let interp = new Interpreter()
