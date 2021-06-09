// Fastrack interpreter
// No multi-track drifting allowed

class Interpreter {
    constructor(code, input) {
        this.code = [];
        this.grid = {};
        this.input = input; // must be an array of bits
    }

    parse(value) {
        this.code = value.split('\n');

        // first two lines are input and output, in that order.
        // input and output points are given as x,y pairs. They must be lazy points.
        // may add a flag later to accomodate string input converted to a byte stream.
        // try {
        //     this.inputPts = JSON.parse(code[0]);
        //     this.outputPts = JSON.parse(code[1]);
        // } catch (e) {
        //     console.log("input/output invalid");
        // }

        // Pad each line to the next multiple of 3
        let largestLineLength = this.code.slice(2).reduce((element, max) => element.length > max ? element.length : max, 0);
        let lengthOfAllLines = largestLineLength + 3 - 1;
        lengthOfAllLines -= (lengthOfAllLines % 3);

        // Make 3x3 tiles
        let rowChunks = this.code.slice(2).map(line => line.padEnd(lengthOfAllLines - line.length, ".").match(/.{1,3}/g));

        for (let row = 0; row < rowChunks.length / 3; row += 1) {
            for (let column = 0; column < rowChunks[row].length; column += 1) {
                this.grid[[row, column]] = [0, 1, 2]
                    .map(i => rowChunks[3 * row + i])
                    .map(chunk => chunk ? chunk[column] : "...");
            }
        }

        console.log(this.grid);
    }

    /*
        Track object specification:
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
        console.log(this.grid);

        for (let i = 0; i < this.grid.length; i++) { // rows
            for (let j = 0; j < this.grid[0].length; j++) { // columns

            }
        }
    }
}

window.interp = new Interpreter();