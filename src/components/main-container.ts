import { Engine } from '../engine';
import { Player } from './player';
import { GameVisualComponent } from '../interfaces/game-visual-component';
import { Background } from './background';
import { ObstacleManager } from './obstacle-manager';

export class MainContainer extends GameVisualComponent {
    player: Player;
    background: Background;
    obstacleManager: ObstacleManager;

    constructor(engine: Engine) {
        super(engine);

        this.player = new Player(this.engine);
        this.background = new Background(this.engine);
        this.obstacleManager = new ObstacleManager(this.engine, this.player);
    }

    draw() {
        // Clear the whole canvas
        this.engine.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);

        this.background.draw();
        this.obstacleManager.draw();
        this.player.draw();
    }

    loop() {
        this.engine.loop();

        this.background.loop();
        this.obstacleManager.loop();
        this.player.loop();
    }

    onSpacePressed() {
        this.player.onSpacePressed();
    }

    start() {
        this.background.start();
        this.obstacleManager.start();
        this.player.start();
    }

    stop() {
        this.background.stop();
        this.obstacleManager.stop();
        this.player.stop();
    }
}

/*
        const _loop = () => {
            if (!this.engine.isGameRunning()) {

            }

            this.loop();
            this.draw();

            window.requestAnimationFrame(_loop);
        };

        window.requestAnimationFrame(_loop);
 */
