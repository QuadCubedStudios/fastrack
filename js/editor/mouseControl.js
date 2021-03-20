import { Editor, TILE_SIZE } from "../index.js";
import { Vec, Vector } from "../util/vector.js";
import { Plugin } from "./plugin.js";

export class MouseControl extends Plugin {
    constructor(/** @type {Editor} */ editor) {
        super(editor);

        /** @type {Vector | null} */
        this.cursorTilePosition = null;

        // For mouse hover square
        editor.canvas.element.addEventListener("mousemove", e => {
            let cursorTilePosition = Vec(e.offsetX, e.offsetY).dividedBy(TILE_SIZE).map(Math.floor, Math.floor);

            if (this.cursorTilePosition !== null) {
                if (this.cursorTilePosition.equals(cursorTilePosition)) {
                    return;
                }
            }

            this.cursorTilePosition = cursorTilePosition;
            editor.redraw();
        });
    }

    draw() {
        // Draw the mouse hover square
        if (this.cursorTilePosition !== null) {
            let hoverSquareCanvasCoords = this.cursorTilePosition.times(TILE_SIZE).add(Vec(1, 1));
            this.editor.canvas.rectangle(hoverSquareCanvasCoords, TILE_SIZE, this.editor.theme.highlightColor, 4);
        }
    }
}