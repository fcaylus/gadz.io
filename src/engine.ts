let isGameRunning = false;
let isDead = false;

export class Engine {
    canvas: HTMLCanvasElement;
    resourcesContainer: HTMLElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, resourcesContainer: HTMLElement) {
        this.resourcesContainer = resourcesContainer;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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

    newGame() {
        isDead = false;
        isGameRunning = true;
    }

    isGameRunning() {
        return isGameRunning;
    }

    isPlayerDead() {
        return isDead;
    }

    loop() {
        this.resizeCanvas();
    }

    private resizeCanvas() {
        this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
}
