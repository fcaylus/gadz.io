import { Engine } from '../engine';
import { GameVisualComponent } from '../interfaces/game-visual-component';
import { Obstacle } from './obstacle';
import { Player } from './player';

export class ObstacleManager extends GameVisualComponent {
    obstacles: Obstacle[];
    newObstacleCooldown: boolean;
    player: Player;

    sprite: HTMLImageElement;

    constructor(engine: Engine, player: Player) {
        super(engine);

        this.player = player;
        this.obstacles = [];
        this.sprite = this.engine.loadImage(require('../assets/img/barrier.svg').default);
    }

    draw() {
        this.obstacles.forEach((obstacle) => obstacle.draw());
    }

    loop() {
        this.obstacles.forEach((obstacle) => obstacle.loop());

        // Remove out of scope obstacles
        this.obstacles = this.obstacles.filter((obstacle) => !obstacle.outOfScope());

        this.obstacles.forEach((obstacle) => {
            if (this.engine.collision(this.player.getBoundingBox(), obstacle.getBoundingBox())) {
                this.engine.gameOver();
            }
        });
    }

    start() {
        delete this.obstacles;
        this.obstacles = [];

        this.newObstacleCooldown = false;

        this.engine.registerIntervalCallback('obstacle-move', 100, () => {
            if (!this.newObstacleCooldown && Math.random() <= this.engine.currentSpawnChance()) {
                const obstacle = new Obstacle(this.engine, this.sprite);
                obstacle.start();
                this.obstacles.push(obstacle);
                this.newObstacleCooldown = true;

                setTimeout(() => {
                    this.newObstacleCooldown = false;
                }, 500);
            }
        });
    }

    stop() {
        this.engine.removeIntervalCallback('obstacle-move');
        this.obstacles.forEach((obstacle) => obstacle.stop());
    }
}
