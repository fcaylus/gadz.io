import { Engine } from '../engine';
import { GAME_SIZE, GROUND_Y } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class HomeScreen extends GameVisualComponent {
    flagSprite: HTMLImageElement;
    gadzSprite: HTMLImageElement;
    frogSprite: HTMLImageElement;
    textBackgroundSprite: HTMLImageElement;

    constructor(engine: Engine) {
        super(engine);
        this.flagSprite = this.engine.loadImage(require('../assets/img/flag.svg').default);
        this.gadzSprite = this.engine.loadImage(require('../assets/img/gadz-front.svg').default);
        this.frogSprite = this.engine.loadImage(require('../assets/img/frog-front.svg').default);
        this.textBackgroundSprite = this.engine.loadImage(require('../assets/img/title-text-background.svg').default);
    }

    getFlagBoundingBox(): BoundingBox {
        const w = GAME_SIZE * 0.2;
        const h = (w * this.flagSprite.height) / this.flagSprite.width;

        const x = -w / 2;
        const y = 0;

        return { x, y, w, h };
    }

    getGadzBoundingBox(): BoundingBox {
        const w = GAME_SIZE * 0.1;
        const h = (w * this.gadzSprite.height) / this.gadzSprite.width;

        const x = -GAME_SIZE / 4 - w / 2;
        const y = GROUND_Y;

        return { x, y, w, h };
    }

    getFrogBoundingBox(): BoundingBox {
        const w = GAME_SIZE * 0.1;
        const h = (w * this.frogSprite.height) / this.frogSprite.width;

        const x = GAME_SIZE / 4 - w / 2;
        const y = GROUND_Y;

        return { x, y, w, h };
    }

    getTextBackgroundBoundingBox(): BoundingBox {
        const w = GAME_SIZE * 0.2;
        const h = (w * this.textBackgroundSprite.height) / this.textBackgroundSprite.width;

        const x = -w / 2;
        const y = GROUND_Y / 2 - h / 2;

        return { x, y, w, h };
    }

    start() {}

    stop() {}

    draw() {
        this.drawFlag();
        this.drawGadz();
        this.drawFrog();
        this.drawText();
    }

    loop() {}

    private drawFlag() {
        const { x, y, w, h } = this.getFlagBoundingBox();
        this.engine.renderer.drawImage(this.flagSprite, x, y, w, h);
    }

    private drawGadz() {
        const { x, y, w, h } = this.getGadzBoundingBox();
        this.engine.renderer.drawImage(this.gadzSprite, x, y, w, h);
    }

    private drawFrog() {
        const { x, y, w, h } = this.getFrogBoundingBox();
        this.engine.renderer.drawImage(this.frogSprite, x, y, w, h);
    }

    private drawText() {
        const { x, y, w, h } = this.getTextBackgroundBoundingBox();
        this.engine.renderer.drawImage(this.textBackgroundSprite, x, y, w, h);
        this.engine.renderer.drawTextCentered(
            '[espace] pour commencer',
            14,
            'sans-serif',
            'white',
            x + w / 2,
            y + h / 2 + 3
        );
    }
}
