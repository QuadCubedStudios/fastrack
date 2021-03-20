/**
 * @callback mapCallback
 * @param {number} coord
 * @returns {number}
 */

export class Vector {
    constructor(/** @type {number} */ x, /** @type {number} */ y) {
        this.x = x;
        this.y = y;
    }

    equals(/** @type {Vector} */ other) {
        return this.x === other.x && this.y === other.y;
    }

    map(/** @type {mapCallback} */ cbX, /** @type {mapCallback} */ cbY) {
        return Vec(cbX(this.x), cbY(this.y));
    }

    add(/** @type {Vector} */ other) {
        return this.map(
            x => x + other.x,
            y => y + other.y
        );
    }

    times(/** @type {Vector} */ other) {
        return this.map(
            x => x * other.x,
            y => y * other.y
        );
    }

    dividedBy(/** @type {Vector} */ other) {
        return this.map(
            x => x / other.x,
            y => y / other.y
        );
    }
}

/**
 * Convenience function for creating Vectors
 * @param {number} x 
 * @param {number} y 
 * @returns {Vector}
 */
export function Vec(x, y) {
    return new Vector(x, y);
}