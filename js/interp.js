// Fastrack interpreter
// No multi-track drifting allowed

const chunk = (arr, chunkSize) => {
    if (chunkSize <= 0) throw "Invalid chunk size";
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
}
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));

class Interpreter {
    constructor(code, input) {
        this.code = code.split('\n')

        // first two lines are input and output, in that order.
        // input and output points are given as x,y pairs. They must be lazy points.
        // may add a flag later to accomodate string input converted to a byte stream.
        try {
            this.inputPts = JSON.parse(code[0]);
            this.outputPts = JSON.parse(code[1]);
        } catch (e) {
            console.log("input/output invalid");
        }
        this.input = input; // must be an array of bits

        this.grid = transpose(transpose(this.code.slice(2).map(line => chunk(line, 3))).map(line => chunk(line, 3)));

    }
    `
        Track object specification:
        Type:
        - Normal(straight line or single turn)
        - Lazy Point(contains a '/' or '\\' at [1,1])
        - Sprung Point(contains one of '^v<>' at [1,1])
        Lazy points have a numeric value(default 0) set by the programmer, I think
        Connections:
        Taken in NSEW format as [0,1,2,3]?
        or possibly, as an object.
    `
    let interpret = () => {
        console.log(this.grid);

        for (let i = 0; i < this.grid.length; i++) { // rows
            for (let j = 0; j < this.grid[0].length; j++) { // columns

            }
        }
    }
}