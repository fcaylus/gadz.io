import { Engine } from '../engine';
import { GameComponent } from './game-component';

export abstract class GameVisualComponent extends GameComponent {
    protected constructor(engine: Engine) {
        super(engine);
    }

    abstract draw(): void;

    getBoundingBox(): BoundingBox {
        return {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
    }
}
