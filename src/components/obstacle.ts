import { Engine } from '../engine';
import { GAME_SIZE, GROUND_Y, PLAYER_WIDTH } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Obstacle extends GameVisualComponent {
    sprite: HTMLImageElement;
    x: number;

    constructor(engine: Engine, sprite: HTMLImageElement) {
        super(engine);

        this.x = GAME_SIZE / 2;

        this.sprite = sprite;
    }

    outOfScope() {
        const bb = this.getBoundingBox();
        return bb.w + bb.w < 0;
    }

    getBoundingBox(): BoundingBox {
        const w = PLAYER_WIDTH;
        const h = w * this.sprite.height / this.sprite.width;

        const x = this.x;
        const y = GROUND_Y;

        return { x, y, w, h };
    }

    start() {
    }

    stop() {
    }

    draw() {
        const { x, y, w, h } = this.getBoundingBox();
        this.engine.renderer.drawImage(this.sprite, x, y, w, h);
    }

    loop() {
        this.x -= this.engine.currentSpeed();
    }
}
