import { Engine } from '../engine';
import { COLOR_GROUND, COLOR_SKY, GAME_SIZE, GROUND_Y } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Background extends GameVisualComponent {
    grassSprite: HTMLImageElement;
    skySprite: HTMLImageElement;

    constructor(engine: Engine) {
        super(engine);
        this.grassSprite = this.engine.loadImage(require('../assets/img/grass.svg').default);
        this.skySprite = this.engine.loadImage(require('../assets/img/sky.svg').default);
    }

    getGrassBoundingBox(): BoundingBox {
        const w = GAME_SIZE;
        const h = (w * this.grassSprite.height) / this.grassSprite.width;

        const x = -GAME_SIZE / 2;
        const y = GROUND_Y - h;

        return { x, y, w, h };
    }

    getSkyBoundingBox(): BoundingBox {
        const w = GAME_SIZE;
        const h = (w * this.skySprite.height) / this.skySprite.width;

        const x = -GAME_SIZE / 2;
        const y = GROUND_Y;

        return { x, y, w, h };
    }

    start() {}

    stop() {}

    draw() {
        // Draw sky background and ground, so it fills the space not covered by the svgs
        const levels = [-GAME_SIZE / 2, GROUND_Y - 1, GAME_SIZE / 2];
        const colors = [COLOR_GROUND, COLOR_SKY];

        for (let i = 0; i < 2; i++) {
            this.engine.renderer.drawRect(-GAME_SIZE / 2, levels[i], GAME_SIZE, levels[i + 1] - levels[i], colors[i]);
        }

        this.drawGrass();
        this.drawSky();
    }

    loop() {}

    private drawGrass() {
        const { x, y, w, h } = this.getGrassBoundingBox();
        this.engine.renderer.drawImage(this.grassSprite, x, y, w, h);
    }

    private drawSky() {
        const { x, y, w, h } = this.getSkyBoundingBox();
        this.engine.renderer.drawImage(this.skySprite, x, y, w, h);
    }
}
