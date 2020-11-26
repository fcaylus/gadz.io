import { Engine } from '../engine';
import { GROUND_Y, MIN_PLAYER_HEIGHT_PX, PLAYER_HEIGHT_PERCENTAGE } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Obstacle extends GameVisualComponent {
    sprite: HTMLImageElement;
    x: number;
    velocity: number;

    constructor(engine: Engine, sprite: HTMLImageElement, velocity: number) {
        super(engine);

        this.x = 1.0;
        this.velocity = velocity;

        this.sprite = sprite;
    }

    outOfScope() {
        const bb = this.getBoundingBox();
        return bb.w + bb.w < 0;
    }

    getBoundingBox(): BoundingBox {
        const h = this.obstacleHeight();
        const w = this.obstacleWidth(h);

        const x = this.x * this.engine.width();
        const y = GROUND_Y * this.engine.height() - h;

        return { x, y, w, h };
    }

    start() {
    }

    stop() {
    }

    draw() {
        const { x, y, w, h } = this.getBoundingBox();
        this.engine.ctx.drawImage(this.sprite, x, y, w, h);
    }

    loop() {
        this.x -= this.velocity;
    }

    private obstacleHeight(): number {
        return Math.max(MIN_PLAYER_HEIGHT_PX, this.engine.height() * PLAYER_HEIGHT_PERCENTAGE) * 0.6;
    }

    private obstacleWidth(height: number) {
        const ratio = this.sprite.width / this.sprite.height;
        return ratio * height;
    }
}
