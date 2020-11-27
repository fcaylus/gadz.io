import { Engine } from '../engine';
import {
    FRICTION,
    GRAVITY,
    GROUND_Y,
    JUMP_ADDITIONAL_VELOCITY,
    JUMP_VELOCITY,
    MAX_JUMP_FRAMES,
    PLAYER_WIDTH
} from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Player extends GameVisualComponent {
    playerSprites: HTMLImageElement[];
    playerHandsUp: boolean;
    playerSpriteSelectorIntervalId: any;

    dy: number;
    velocity: number;
    jumping: boolean;
    // Count the number of frames the space bar was clicked
    jumpingFrames: number;
    // True as long as the user keep pressing the space bar
    jumpingInitialPulse: boolean;
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

    loop(spacePressed) {
        if (spacePressed) {
            if (!this.jumpCooldown) {
                if (this.jumping && this.jumpingInitialPulse && this.jumpingFrames < MAX_JUMP_FRAMES) {
                    this.jumpingFrames += 1;
                    this.velocity += JUMP_ADDITIONAL_VELOCITY;
                } else if (!this.jumping) {
                    this.jumping = true;
                    this.jumpingInitialPulse = true;
                    this.jumpingFrames = 0;
                    this.velocity = JUMP_VELOCITY;
                }
            }
        } else {
            this.jumpingInitialPulse = false;
        }

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

    private playerSprite(): HTMLImageElement {
        if (this.jumping) {
            return this.playerSprites[1];
        }
        return this.playerHandsUp ? this.playerSprites[1] : this.playerSprites[0];
    }
}
