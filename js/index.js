'use strict';

import { Canvas } from "./util/canvas.js";

import { Plugin } from "./editor/plugin.js";
import { MouseControl } from "./editor/mouseControl.js";
import { Vec } from "./util/vector.js";

export const TILE_SIZE = Vec(64, 64);

export class Editor {
    constructor(/** @type {HTMLElement} */ element) {
        let canvas = document.createElement("canvas");

        element.appendChild(canvas);

        this.canvas = new Canvas(canvas);
        this.program = {
            tiles: [
                {
                    position: Vec(0, 0),
                    tile: "rail",
                    rotation: 0,
                }
            ]
        };
        this.pendingDraw = null;
        this.plugins = [
            new MouseControl(this)
        ];

        let styles = window.getComputedStyle(element);
        this.theme = {
            gridColor: styles.getPropertyValue("--fastrack-grid-color"),
            highlightColor: styles.getPropertyValue("--fastrack-highlight-color"),
        };        

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
                this.canvas.line(Vec(x, 0), Vec(x, this.canvas.dimensions.y), this.theme.gridColor, 2);
            }

            for (let y = 0; y < this.canvas.dimensions.y; y += TILE_SIZE.y) {
                this.canvas.line(Vec(0, y), Vec(this.canvas.dimensions.x, y), this.theme.gridColor, 2);
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
