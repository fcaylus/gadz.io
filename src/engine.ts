import { Container } from './components/container';

let isGameRunning = false;
let isDead = false;

export class Engine {
    canvas: HTMLCanvasElement;
    resourcesContainer: HTMLElement;
    ctx: CanvasRenderingContext2D;

    gameContainer: Container;
    firstRender: boolean;

    constructor(canvas: HTMLCanvasElement, resourcesContainer: HTMLElement) {
        this.firstRender = true;

        this.resourcesContainer = resourcesContainer;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.gameContainer = new Container(this);
    }

    loadImage(path: string): HTMLImageElement {
        const img: HTMLImageElement = document.createElement('img');
        img.src = path;
        img.alt = '';
        this.resourcesContainer.appendChild(img);
        return img;
    }

    collision(bb1: BoundingBox, bb2: BoundingBox): boolean {
        return (bb1.x < bb2.x + bb2.w
            && bb1.x + bb1.w > bb2.x
            && bb1.y < bb2.y + bb2.h
            && bb1.y + bb1.h > bb2.y);
    }

    gameOver() {
        console.log('💀  Game over !');
        isDead = true;
        isGameRunning = false;
    }

    isGameRunning() {
        return isGameRunning;
    }

    isPlayerDead() {
        return isDead;
    }

    width() {
        return this.canvas.width;
    }

    height() {
        return this.canvas.height;
    }

    /**
     * Game entrypoint. Should be called by the main JavaScript file.
     */
    run() {
        // Main game loop
        const _loop = () => {
            // Stop the game
            if (!this.firstRender && !this.isGameRunning()) {
                if (this.isPlayerDead()) {
                    document.getElementById('dead-popup').style.display = 'flex';
                }

                this.gameContainer.stop();

                return;
            }

            this.firstRender = false;

            this.resizeCanvas();

            // Clear the whole canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.gameContainer.loop();
            this.gameContainer.draw();

            window.requestAnimationFrame(_loop);
        };

        this.registerKeyHandler(_loop);
        this.gameContainer.start();
        window.requestAnimationFrame(_loop);
    }

    private registerKeyHandler(gameLoop: () => void) {
        document.onkeydown = (e) => {
            if (e.code === 'Space') {
                // Start the game if not running
                if (!this.isGameRunning()) {
                    document.getElementById('start-popup').style.display = 'none';
                    document.getElementById('dead-popup').style.display = 'none';

                    this.newGame();
                    this.gameContainer.start();
                    window.requestAnimationFrame(gameLoop);
                } else {
                    // Simply propagate the event
                    this.gameContainer.onSpacePressed();
                }
            }
        };
    }

    private newGame() {
        isDead = false;
        isGameRunning = true;
    }

    private resizeCanvas() {
        this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
}
