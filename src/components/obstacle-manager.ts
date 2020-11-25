import { Engine } from '../engine';
import { OBSTACLE_SPAWN_CHANCE, OBSTACLE_VELOCITY } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';
import { Obstacle } from './obstacle';
import { Player } from './player';

export class ObstacleManager extends GameVisualComponent {
    obstacles: Obstacle[];
    newObstacleIntervalId: any;
    newObstacleCooldown: boolean;
    player: Player;

    sprite: HTMLImageElement;

    constructor(engine: Engine, player: Player) {
        super(engine);

        this.player = player;
        this.obstacles = [];
        this.sprite = this.engine.loadImage(require('../assets/img/barrier.svg').default);
    }

    start() {
        delete this.obstacles;
        this.obstacles = [];

        this.newObstacleCooldown = false;

        this.newObstacleIntervalId = setInterval(() => {
            if (!this.newObstacleCooldown && Math.random() <= OBSTACLE_SPAWN_CHANCE) {
                const obstacle = new Obstacle(this.engine, this.sprite, OBSTACLE_VELOCITY);
                obstacle.start();
                this.obstacles.push(obstacle);
                this.newObstacleCooldown = true;

                setTimeout(() => {
                    this.newObstacleCooldown = false;
                }, 500);
            }
        }, 100);
    }

    stop() {
        clearInterval(this.newObstacleIntervalId);
        this.obstacles.forEach(obstacle => obstacle.stop());
    }

    draw() {
        this.obstacles.forEach(obstacle => obstacle.draw());
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
}
