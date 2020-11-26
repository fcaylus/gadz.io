import { Engine } from '../engine';
import { FRICTION, GRAVITY, GROUND_Y, JUMP_VELOCITY, PLAYER_WIDTH } from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Player extends GameVisualComponent {
    playerSprites: HTMLImageElement[];
    playerHandsUp: boolean;
    playerSpriteSelectorIntervalId: any;

    dy: number;
    velocity: number;
    jumping: boolean;
    jumpCooldown: boolean;

    constructor(engine: Engine) {
        super(engine);

        this.playerSprites = [
            this.engine.loadImage(require('../assets/img/player-1.svg').default),
            this.engine.loadImage(require('../assets/img/player-2.svg').default)
        ];
    }

    getBoundingBox(): BoundingBox {
        const sprite = this.playerSprite();
        const w = PLAYER_WIDTH;
        const h = w * sprite.height / sprite.width;

        const x = 0 - w / 2;
        const y = GROUND_Y + this.dy;

        return { x, y, w, h };
    }

    start() {
        this.dy = 0;
        this.velocity = 0;
        this.jumping = false;
        this.jumpCooldown = false;

        this.playerHandsUp = false;

        this.playerSpriteSelectorIntervalId = setInterval(() => {
            this.playerHandsUp = !this.playerHandsUp;
        }, 200);
    }

    stop() {
        clearInterval(this.playerSpriteSelectorIntervalId);
    }

    draw() {
        const sprite = this.playerSprite();
        const { x, y, w, h } = this.getBoundingBox();

        this.engine.renderer.drawImage(sprite, x, y, w, h);
    }

    loop() {
        this.dy += this.velocity;
        this.velocity *= FRICTION;
        this.velocity -= GRAVITY;

        if (this.dy < 0) {
            this.dy = 0;
            this.velocity = 0;

            if (this.jumping) {
                this.jumping = false;
                this.jumpCooldown = true;
                setTimeout(() => {
                    this.jumpCooldown = false;
                }, 10);
            }
        }
    }

    onSpacePressed() {
        super.onSpacePressed();

        if (!this.jumping && !this.jumpCooldown) {
            this.jumping = true;
            this.velocity = JUMP_VELOCITY;
        }
    }

    private playerSprite(): HTMLImageElement {
        if (this.jumping) {
            return this.playerSprites[1];
        }
        return this.playerHandsUp ? this.playerSprites[1] : this.playerSprites[0];
    }
}
