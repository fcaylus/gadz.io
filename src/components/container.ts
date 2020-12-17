import { Engine } from '../engine';
import { Player } from './player';
import { GameVisualComponent } from '../interfaces/game-visual-component';
import { Background } from './background';
import { ObstacleManager } from './obstacle-manager';
import { HomeScreen } from './home-screen';

export class Container extends GameVisualComponent {
    player: Player;
    background: Background;
    obstacleManager: ObstacleManager;
    homeScreen: HomeScreen;

    constructor(engine: Engine) {
        super(engine);

        this.player = new Player(this.engine);
        this.background = new Background(this.engine);
        this.obstacleManager = new ObstacleManager(this.engine, this.player);
        this.homeScreen = new HomeScreen(this.engine);
    }

    draw() {
        this.background.draw();
        this.obstacleManager.draw();
        this.player.draw();
    }

    drawHomeScreen() {
        this.background.draw();
        this.homeScreen.draw();
    }

    loop(spacePressed) {
        this.background.loop();
        this.obstacleManager.loop();
        this.player.loop(spacePressed);
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
