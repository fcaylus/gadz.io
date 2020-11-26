import { GAME_SIZE } from './constants';

/**
 * Game renderer that handle all canvas drawing.
 * All input coordinates should be in "game coordinates", and are translated to "screen coordinates" on the fly
 *
 * Game coordinates:
 * -----------------
 *
 * (- GAME_SIZE/2, + GAME_SIZE/2) ------------- (+ GAME_SIZE/2, + GAME_SIZE/2)
 *               |                                            |
 *               |                                            |
 *               |                                            |
 *               |                                            |
 *               |                                            |
 *               |                    (0, 0)                  |
 *               |                                            |
 *               |                                            |
 *               |                                            |
 *               |                                            |
 *               |                                            |
 * (- GAME_SIZE/2, - GAME_SIZE/2) ------------- (+ GAME_SIZE/2, - GAME_SIZE/2)
 *
 * Screen coordinates:
 * -------------------
 *
 * (0, < 0) ----------- (w, < 0)
 *   |                    |
 *   |                    |
 *   |                    |
 * (0, h/2)            (w, h/2)
 *   |                    |
 *   |                    |
 *   |                    |
 * (0, > h) ----------- (w, > h)
 *
 * In screen coordinates, if the screen is not square, the edges should be outside the screen.
 */
export class Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    width() {
        return this.canvas.width;
    }

    height() {
        return this.canvas.height;
    }

    /**
     * Draw a rectangle, with coordinates as follows:
     *
     *  (x, y+h) --- (x+w, y+h)
     *    |              |
     *    |              |
     *  (x, y) ----- (x+w, y)
     */
    drawRect(x: number, y: number, w: number, h: number, color: string) {
        const my = this.mapY(y);
        const mh = this.scale(h);

        if (this.isOutsideY(my) && this.isOutsideY(my - mh)) {
            return;
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.mapX(x), my - mh, this.scale(w), mh);
    }

    /**
     * Draw an image, with coordinates as follows:
     *
     *  (x, y+h) --- (x+w, y+h)
     *    |              |
     *    |              |
     *  (x, y) ----- (x+w, y)
     */
    drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number) {
        const my = this.mapY(y);
        const mh = this.scale(h);

        if (this.isOutsideY(my) && this.isOutsideY(my - mh)) {
            return;
        }

        this.ctx.drawImage(image, this.mapX(x), my - mh, this.scale(w), mh);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    private scale(val: number) {
        return val * this.canvas.width / GAME_SIZE;
    }

    private mapX(x: number) {
        return this.scale(x + GAME_SIZE / 2);
    }

    private mapY(y: number) {
        return (this.canvas.height / 2) - this.scale(y);
    }

    private isOutsideY(y: number) {
        return y < 0 || y > this.canvas.height;
    }
}
