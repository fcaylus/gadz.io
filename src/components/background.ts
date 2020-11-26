import { Engine } from '../engine';
import { COLOR_GROUND_1, COLOR_GROUND_2, COLOR_SKY, GAME_SIZE, GROUND_Y } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Background extends GameVisualComponent {
    constructor(engine: Engine) {
        super(engine);
    }

    start() {
    }

    stop() {
    }

    draw() {
        // Different terrain levels in percentage
        const levels = [-GAME_SIZE / 2, GROUND_Y - 50, GROUND_Y, GAME_SIZE / 2];
        const colors = [
            COLOR_GROUND_1,
            COLOR_GROUND_2,
            COLOR_SKY
        ];

        for (let i = 0; i < 3; i++) {
            this.engine.renderer.drawRect(-GAME_SIZE / 2, levels[i], GAME_SIZE, (levels[i + 1] - levels[i]), colors[i]);
        }
    }

    loop() {

    }
}
