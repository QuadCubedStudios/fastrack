import { Editor, TILE_SIZE } from "../index.js";
import { Vector } from "../util/canvas.js";
import { Plugin } from "./plugin.js";

export class MouseHover extends Plugin {
    constructor(/** @type {Editor} */ editor) {
        super(editor);

        this.cursorTilePosition = null;

        // For mouse hover square
        editor.canvas.element.addEventListener("mousemove", e => {
            if (this.cursorTilePosition !== null) {
                if (Math.floor(e.offsetX / TILE_SIZE.x) === this.cursorTilePosition.x && Math.floor(e.offsetY / TILE_SIZE.y) === this.cursorTilePosition.y) {
                    return;
                }
            }
            this.cursorTilePosition = Vector(Math.floor(e.offsetX / TILE_SIZE.x), Math.floor(e.offsetY / TILE_SIZE.y));
            editor.redraw();
        });
    }

    draw() {
        // Draw the mouse hover square
        let mouseHoverCanvasCoords = Vector(this.cursorTilePosition.x * TILE_SIZE.x, this.cursorTilePosition.y * TILE_SIZE.y);
        this.editor.canvas.rectangle(mouseHoverCanvasCoords, TILE_SIZE, "white", 4);        
    }
}