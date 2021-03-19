'use strict';

import { Canvas, Vector } from "./util/canvas.js";

import { Plugin } from "./editor/plugin.js";
import { MouseHover } from "./editor/mouseHover.js";

export const TILE_SIZE = Vector(64, 64);

export class Editor {
    constructor(/** @type {HTMLCanvasElement} */ element) {
        this.canvas = new Canvas(element);
        this.pendingDraw = null;
        this.plugins = [
            new MouseHover(this)
        ];

        this.resize();
    }

    resize() {
        this.canvas.resize();
        this.redraw();
    }

    redraw() {
        // Cancel any pending draw calls so we don't draw too many times
        if (this.pendingDraw !== null) {
            cancelAnimationFrame(this.pendingDraw);
        }
        // Draw on the next frame
        this.pendingDraw = requestAnimationFrame(() => {
            // Clear the canvas
            this.canvas.clear();

            // Draw the base grid
            for (let x = 0; x < this.canvas.dimensions.x; x += TILE_SIZE.x) {
                this.canvas.line(Vector(x, 0), Vector(x, this.canvas.dimensions.y), "rgba(255, 255, 255, 0.4)", 2);
            }
    
            for (let y = 0; y < this.canvas.dimensions.y; y += TILE_SIZE.y) {
                this.canvas.line(Vector(0, y), Vector(this.canvas.dimensions.x, y), "rgba(255, 255, 255, 0.4)", 2);
            }

            for (const plugin of this.plugins) {
                plugin.draw();
            }

            // Clear the pending draw
            this.pendingDraw = null;
        });
    }
}

let editor = new Editor(document.querySelector("#editor"));
window.addEventListener("resize", () => editor.resize());
