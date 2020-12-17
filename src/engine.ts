import { Container } from './components/container';
import { Renderer } from './renderer';
import {
    OBSTACLE_INITIAL_SPAWN_CHANCE,
    OBSTACLE_MAX_SPAWN_CHANCE,
    OBSTACLE_SPAWN_CHANCE_INCREMENT,
    OBSTACLE_SPAWN_CHANCE_INCREMENT_DURATION,
    PLAYER_INITIAL_SPEED,
    PLAYER_SPEED_INCREMENT,
    PLAYER_SPEED_INCREMENT_DURATION,
} from './constants';
import { SpriteManager } from './sprite-manager';

let isGameRunning = false;
let isDead = false;

export class Engine {
    counterElement: HTMLElement;
    renderer: Renderer;
    spriteManager: SpriteManager;

    gameContainer: Container;

    frameCount: number;
    lastCounterUpdate: number;

    isStopRequested: boolean;
    spacePressed: boolean;

    constructor() {
        this.isStopRequested = false;

        this.spriteManager = new SpriteManager();
        this.counterElement = document.getElementById('counter');
        const canvas = document.getElementById('game') as HTMLCanvasElement;

        this.renderer = new Renderer(canvas);
        this.gameContainer = new Container(this);
    }

    loadImage(path: string): HTMLImageElement {
        return this.spriteManager.loadSprite(path);
    }

    collision(bb1: BoundingBox, bb2: BoundingBox): boolean {
        return bb1.x < bb2.x + bb2.w && bb1.x + bb1.w > bb2.x && bb1.y < bb2.y + bb2.h && bb1.y + bb1.h > bb2.y;
    }

    currentSpeed() {
        return (
            PLAYER_INITIAL_SPEED +
            Math.floor(this.frameCount / PLAYER_SPEED_INCREMENT_DURATION) * PLAYER_SPEED_INCREMENT
        );
    }

    currentSpawnChance() {
        return Math.min(
            OBSTACLE_MAX_SPAWN_CHANCE,
            OBSTACLE_INITIAL_SPAWN_CHANCE +
                Math.floor(this.frameCount / OBSTACLE_SPAWN_CHANCE_INCREMENT_DURATION) * OBSTACLE_SPAWN_CHANCE_INCREMENT
        );
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
            if (this.isStopRequested) {
                if (isDead) {
                    document.getElementById('dead-popup').style.display = 'flex';
                }

                this.gameContainer.stop();
                isGameRunning = false;
            } else if (!isDead && !isGameRunning) {
                this.renderer.resizeCanvas();
                this.spriteManager.allSpritesLoaded().then(() => {
                    this.gameContainer.drawHomeScreen();
                });
            } else {
                this.updateCounter();

                this.frameCount += 1;

                this.renderer.resizeCanvas();
                this.renderer.clear();

                this.gameContainer.loop(this.spacePressed);
                this.gameContainer.draw();
            }

            window.requestAnimationFrame(_loop);
        };

        this.registerEventListeners();
        this.newGame();
        window.requestAnimationFrame(_loop);
    }

    private registerEventListeners() {
        this.spacePressed = false;

        const onSpacePressed = () => {
            // Start the game if not running
            if (!isGameRunning) {
                document.getElementById('dead-popup').style.display = 'none';

                isDead = false;
                isGameRunning = true;
                this.isStopRequested = false;
                this.newGame();
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

    private newGame() {
        this.lastCounterUpdate = 0;
        this.frameCount = 0;

        this.gameContainer.start();
    }

    private updateCounter() {
        // Only update the counter every 50 ms
        const now = Date.now();
        if (now - this.lastCounterUpdate > 50) {
            this.lastCounterUpdate = now;

            const numberOfChunkFullyRan = Math.floor(this.frameCount / PLAYER_SPEED_INCREMENT_DURATION);
            let distance = 0;
            for (let i = 0; i < numberOfChunkFullyRan; i++) {
                distance += PLAYER_SPEED_INCREMENT_DURATION * (PLAYER_INITIAL_SPEED + i * PLAYER_SPEED_INCREMENT);
            }
            // Add the distance of the "current chunk"
            distance +=
                (this.frameCount - numberOfChunkFullyRan * PLAYER_SPEED_INCREMENT_DURATION) *
                (PLAYER_INITIAL_SPEED + numberOfChunkFullyRan * PLAYER_SPEED_INCREMENT);

            this.counterElement.innerText = `${Intl.NumberFormat('fr-FR').format(distance)} m`;
        }
    }
}
