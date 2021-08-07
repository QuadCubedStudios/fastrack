'use strict';

class Editor {
    constructor() {
        this.currentPosition = [0, 0];
        this.currentDelta = [1, 0];
        this.code = {};

        this.cursor = document.querySelector(".cursor");

        hotkeys("up", () => this.pointCursor([0, -1]));
        hotkeys("down", () => this.pointCursor([0, 1]));
        hotkeys("left", () => this.pointCursor([-1, 0]));
        hotkeys("right", () => this.pointCursor([1, 0]));

        hotkeys("3", () => this.paintAtCursor("track"));
        hotkeys("space", () => this.paintAtCursor(""));
    }

    pointCursor(direction) {
        this.currentDelta = direction;
    }

    paintAtCursor(type) {
        let [x, y] = this.currentPosition;
        let id = `piece-${x}-${y}`;
        let tileSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--fastrack-tile-size'), 10);

        if (type !== "") {
            let piece = document.querySelector(`#${id}`);
            if (piece) {
                piece.innerText = type;
            } else {
                piece = document.createElement("div");
                piece.id = `${x}-${y}`;
                piece.classList.add("piece");
                piece.classList.add(type);
                piece.style.top = `${y * tileSize}px`;
                piece.style.left = `${x * tileSize}px`;    
                piece.innerText = "#";
    
                document.querySelector("#pieces").appendChild(piece);
            }
        }

        x += this.currentDelta[0];
        y += this.currentDelta[1];
        this.currentPosition = [Math.max(x, 0), Math.max(y, 0)];
        this.cursor.style.top = `${y * tileSize}px`;
        this.cursor.style.left = `${x * tileSize}px`;
        this.cursor.scrollIntoView();
    }
}

window.editor = new Editor();