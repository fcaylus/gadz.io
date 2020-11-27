import { Container } from './components/container';
import { Renderer } from './renderer';
import { OBSTACLE_VELOCITY } from './constants';

let isGameRunning = false;
let isDead = false;

export class Engine {
    resourcesContainer: HTMLElement;
    counterElement: HTMLElement;
    renderer: Renderer;

    gameContainer: Container;
    firstRender: boolean;

    startTime: number;
    lastCounterUpdate: number;

    isStopRequested: boolean;
    spacePressed: boolean;

    constructor() {
        this.firstRender = true;
        this.isStopRequested = false;

        this.resourcesContainer = document.getElementById('resources-container');
        this.counterElement = document.getElementById('counter');
        const canvas = document.getElementById('game') as HTMLCanvasElement;

        this.renderer = new Renderer(canvas);
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
        this.isStopRequested = true;
    }

    /**
     * Game entrypoint. Should be called by the main JavaScript file.
     */
    run() {
        // Main game loop
        const _loop = () => {
            // Stop the game
            if (!this.firstRender && (this.isStopRequested || !isGameRunning)) {
                if (isDead) {
                    document.getElementById('dead-popup').style.display = 'flex';
                }

                this.gameContainer.stop();
                isGameRunning = false;
                return;
            }

            if (!this.firstRender) {
                this.updateCounter();
            }

            this.firstRender = false;

            this.renderer.resizeCanvas();
            this.renderer.clear();

            this.gameContainer.loop(this.spacePressed);
            this.gameContainer.draw();

            window.requestAnimationFrame(_loop);
        };

        this.registerEventListeners(_loop);
        this.newGame(_loop);
    }

    private registerEventListeners(gameLoop: () => void) {
        this.spacePressed = false;

        const onSpacePressed = () => {
            // Start the game if not running
            if (!isGameRunning) {
                document.getElementById('start-popup').style.display = 'none';
                document.getElementById('dead-popup').style.display = 'none';

                isDead = false;
                isGameRunning = true;
                this.isStopRequested = false;
                this.newGame(gameLoop);
            } else {
                // Simply propagate the event
                this.spacePressed = true;
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                onSpacePressed();
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.spacePressed = false;
            }
        });
        document.addEventListener('touchstart', onSpacePressed);
        document.addEventListener('touchend', () => {
            this.spacePressed = false;
        });
    }

    private newGame(gameLoop: () => void) {
        this.lastCounterUpdate = 0;
        this.startTime = Date.now();

        this.gameContainer.start();
        window.requestAnimationFrame(gameLoop);
    }

    private updateCounter() {
        const now = Date.now();
        if (now - this.lastCounterUpdate > 50) {
            this.lastCounterUpdate = now;
            const distance = OBSTACLE_VELOCITY * (now - this.startTime);
            this.counterElement.innerText = `${Intl.NumberFormat('fr-FR').format(distance)} m`;
        }
    }
}
