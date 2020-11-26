import { Engine } from '../engine';
import {
    FRICTION,
    GRAVITY,
    GROUND_Y,
    JUMP_VELOCITY,
    MIN_PLAYER_HEIGHT_PX,
    PLAYER_HEIGHT_PERCENTAGE,
    PLAYER_POSITION_X
} from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Player extends GameVisualComponent {
    playerSprites: HTMLImageElement[];
    playerHandsUp: boolean;
    playerSpriteSelectorIntervalId: any;

    x: number;
    y: number;
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
        const h = this.playerHeight();
        const w = this.playerWidth(h, sprite);

        const x = this.playerX();
        const y = this.playerY(h);

        return { x, y, w, h };
    }

    start() {
        this.x = PLAYER_POSITION_X;
        this.y = 0;
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

        this.engine.ctx.drawImage(sprite, x, y, w, h);
    }

    loop() {
        this.y += this.velocity;
        this.velocity *= FRICTION;
        this.velocity -= GRAVITY;

        if (this.y < 0) {
            this.y = 0;
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

    private playerX(): number {
        return this.x * this.engine.width();
    }

    private playerY(height): number {
        const offset = this.engine.height() * GROUND_Y - height;
        return offset - this.engine.height() * this.y;
    }

    private playerSprite(): HTMLImageElement {
        if (this.jumping) {
            return this.playerSprites[1];
        }
        return this.playerHandsUp ? this.playerSprites[1] : this.playerSprites[0];
    }

    private playerHeight(): number {
        return Math.max(MIN_PLAYER_HEIGHT_PX, this.engine.height() * PLAYER_HEIGHT_PERCENTAGE);
    }

    private playerWidth(height: number, sprite: HTMLImageElement) {
        const ratio = sprite.width / sprite.height;
        return ratio * height;
    }
}
