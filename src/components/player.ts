import { Engine } from '../engine';
import {
    FRICTION,
    GRAVITY,
    GROUND_Y,
    JUMP_ADDITIONAL_VELOCITY,
    JUMP_COOLDOWN_DURATION,
    JUMP_VELOCITY,
    MAX_JUMP_FRAMES,
    PLAYER_WIDTH,
} from '../constants';
import { GameVisualComponent } from '../interfaces/game-visual-component';

export class Player extends GameVisualComponent {
    playerSprites: HTMLImageElement[];
    playerHandsUp: boolean;

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
            // w/ hands "down"
            this.engine.loadImage(require('../assets/img/player-1.svg').default),
            // w/ hands "up"
            this.engine.loadImage(require('../assets/img/player-2.svg').default),
        ];
    }

    getBoundingBox(): BoundingBox {
        const sprite = this.playerSprite();
        const w = PLAYER_WIDTH;
        const h = (w * sprite.height) / sprite.width;

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

        this.engine.registerIntervalCallback('player-sprite', 200, () => {
            this.playerHandsUp = !this.playerHandsUp;
        });
    }

    stop() {
        this.engine.removeIntervalCallback('player-sprite');
    }

    draw() {
        const sprite = this.playerSprite();
        const { x, y, w, h } = this.getBoundingBox();

        this.engine.renderer.drawImage(sprite, x, y, w, h);
    }

    loop(spacePressed) {
        if (spacePressed) {
            if (!this.jumpCooldown) {
                // "in jump" space bar pressed, so the player can jump higher
                if (this.jumping && this.jumpingInitialPulse && this.jumpingFrames < MAX_JUMP_FRAMES) {
                    this.jumpingFrames += 1;
                    this.velocity += JUMP_ADDITIONAL_VELOCITY;
                } else if (!this.jumping) {
                    // start jumping
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
        this.velocity = this.velocity * FRICTION - GRAVITY;

        if (this.dy < 0) {
            this.dy = 0;
            this.velocity = 0;

            // stop jumping when the ground is reached
            if (this.jumping) {
                this.jumping = false;
                this.jumpCooldown = true;
                setTimeout(() => {
                    this.jumpCooldown = false;
                }, JUMP_COOLDOWN_DURATION);
            }
        }
    }

    private playerSprite(): HTMLImageElement {
        // always shows "hands up" while jumping
        if (this.jumping) {
            return this.playerSprites[1];
        }

        return this.playerHandsUp ? this.playerSprites[1] : this.playerSprites[0];
    }
}
