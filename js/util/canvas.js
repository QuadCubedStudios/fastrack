'use strict';


/**
 * A 2D Vector
 * @typedef {Object} Vector
 * @property {number} x
 * @property {number} y
 */
export function Vector(/** @type {number} */ x, /** @type {number} */ y) {
    return { x, y };
}

/**
 * @typedef {string | CanvasGradient | CanvasPattern} StrokeStyle
 */

export class Canvas {
    constructor(/**@type {HTMLCanvasElement} */ canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", { alpha: true });
    }

    get element() {
        return this.canvas;
    }

    get dimensions() {
        return Vector(this.canvas.width, this.canvas.height);
    }

    set dimensions(/** @type {Vector} */ dim) {
        this.canvas.width = dim.x;
        this.canvas.height = dim.y;
    }

    resize() {
        let parent = this.canvas.parentElement.getBoundingClientRect();
        this.dimensions = Vector(parent.width, parent.height);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    line(/** @type {Vector} */ from, /** @type {Vector} */ to, /** @type {StrokeStyle} */ strokeStyle, /** @type {number} */ lineWidth) {
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    rectangle(/** @type {Vector} */ at, /** @type {Vector} */ dimensions, /** @type {StrokeStyle} */ strokeStyle, /** @type {number} */ lineWidth) {
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.strokeRect(at.x, at.y, dimensions.x, dimensions.y);
    }
}