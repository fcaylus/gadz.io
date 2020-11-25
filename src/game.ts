import { Engine } from './engine';
import { MainContainer } from './components/main-container';

export class Game {
    mainContainer: MainContainer;
    engine: Engine;

    constructor() {
        const resourcesContainer = document.getElementById('resources-container');
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        this.engine = new Engine(canvas, resourcesContainer);
        this.mainContainer = new MainContainer(this.engine);
    }

    run() {
        let firstRender = true;

        const _loop = () => {
            if (firstRender || this.engine.isGameRunning()) {
                firstRender = false;

                this.mainContainer.loop();
                this.mainContainer.draw();

                window.requestAnimationFrame(_loop);
            } else {
                if (this.engine.isPlayerDead()) {
                    document.getElementById('dead-popup').style.display = 'flex';
                }

                this.mainContainer.stop();
            }
        };

        document.onkeydown = (e) => {
            if (e.code === 'Space') {
                if (!this.engine.isGameRunning()) {
                    document.getElementById('start-popup').style.display = 'none';
                    document.getElementById('dead-popup').style.display = 'none';

                    this.engine.newGame();
                    this.mainContainer.start();
                    window.requestAnimationFrame(_loop);

                } else {
                    this.mainContainer.onSpacePressed();
                }
            }
        };

        this.mainContainer.start();
        window.requestAnimationFrame(_loop);
    }
}
