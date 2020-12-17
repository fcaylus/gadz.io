interface Sprite {
    img: HTMLImageElement;
    loaded: boolean;
}

export class SpriteManager {
    resourcesContainer: HTMLElement;
    private sprites = new Map<string, Sprite>();

    constructor() {
        this.resourcesContainer = document.getElementById('resources-container');
    }

    loadSprite(path: string): HTMLImageElement {
        if (this.sprites.has(path)) {
            return this.sprites.get(path).img;
        }

        const sprite: Sprite = {
            img: document.createElement('img'),
            loaded: false,
        };

        this.sprites.set(path, sprite);

        const that = this;
        sprite.img.onload = function () {
            const s = that.sprites.get(path);
            s.loaded = true;
            that.sprites.set(path, s);
        };

        sprite.img.src = path;
        sprite.img.alt = '';
        this.sprites.set(path, sprite);

        this.resourcesContainer.appendChild(sprite.img);

        return sprite.img;
    }

    areAllSpritesLoaded(): boolean {
        return Array.from(this.sprites.values()).filter((sprite) => !sprite.loaded).length === 0;
    }

    async allSpritesLoaded(): Promise<void> {
        const sleep = async () => await new Promise((r) => setTimeout(r, 50));

        return new Promise(async (resolve) => {
            while (!this.areAllSpritesLoaded()) {
                await sleep();
            }
            resolve();
        });
    }
}
