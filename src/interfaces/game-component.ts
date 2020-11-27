import { Engine } from '../engine';

export abstract class GameComponent {
    protected engine: Engine;

    protected constructor(engine: Engine) {
        this.engine = engine;
    }

    abstract start(): void;

    abstract stop(): void;

    abstract loop(spacePressed: boolean): void;
}
