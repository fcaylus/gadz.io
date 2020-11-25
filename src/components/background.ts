import { Engine } from '../engine';
import { COLOR_GROUND_1, COLOR_GROUND_2, COLOR_SKY, GROUND_Y } from '../constants';
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
        const levels = [0, GROUND_Y, GROUND_Y + 0.1, 1.0];
        const colors = [
            COLOR_SKY,
            COLOR_GROUND_2,
            COLOR_GROUND_1
        ];

        for (let i = 0; i < 3; i++) {
            this.engine.ctx.fillStyle = colors[i];
            this.engine.ctx.fillRect(
                0,
                this.engine.canvas.height * levels[i],
                this.engine.canvas.width,
                this.engine.canvas.height * (levels[i + 1] - levels[i])
            );
        }

        // Reset color
        this.engine.ctx.fillStyle = '#ffffff';
    }

    loop() {

    }
}
