import { COLOR_BACKGROUND_RESET, GAME_SIZE } from './constants';

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

    /**
     * Draw a rectangle, with coordinates as follows:
     *
     *  (x, y+h) --- (x+w, y+h)
     *    |              |
     *    |              |
     *  (x, y) ----- (x+w, y)
     */
    drawRect(x: number, y: number, w: number, h: number, color: string) {
        let my = this.mapY(y);
        let mh = this.scale(h);

        if (this.isOutsideY(my) && this.isOutsideY(my - mh)) {
            return;
        }

        // Special case, for drawing at the top and bottom border
        if (y + h >= GAME_SIZE / 2) {
            mh = my;
        } else if (y <= -GAME_SIZE / 2) {
            mh += this.canvas.height - my;
            my = this.canvas.height;
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

    /**
     * Draw a text, centered around (cx, cy) and with the specified text height
     */
    drawTextCentered(text: string, textHeight: number, font: string, color: string, cx: number, cy: number) {
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.font = `${this.scale(textHeight)}px ${font}`;
        this.ctx.fillStyle = color;

        this.ctx.fillText(text, this.mapX(cx), this.mapY(cy));
    }

    clear() {
        this.ctx.fillStyle = COLOR_BACKGROUND_RESET;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    private scale(val: number) {
        return (val * this.canvas.width) / GAME_SIZE;
    }

    private mapX(x: number) {
        return this.scale(x + GAME_SIZE / 2);
    }

    private mapY(y: number) {
        return this.canvas.height / 2 - this.scale(y);
    }

    private isOutsideY(y: number) {
        return y < 0 || y > this.canvas.height;
    }
}
