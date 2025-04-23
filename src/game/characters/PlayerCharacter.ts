import { BaseCharacter, BaseStats } from "./BaseCharacter";

export class PlayerCharacter extends BaseCharacter {
    private name: string;
    private level: number;

    constructor(name: string, level: number, stats: BaseStats) {
        super(stats);
        this.name = name;
        this.level = level;
    }

    focusCamera(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): void {
        scene.cameras.main.startFollow(sprite, true, 0.1, 0.1);
    }
    
    getName(): string {
        return this.name;
    }

    getLevel(): number {
        return this.level;
    }

    levelUp(): void {
        this.level += 1;
        this.updateStats({
            health: this.getStats().health + 10,
            attack: this.getStats().attack + 2,
            defense: this.getStats().defense + 2,
            speed: this.getStats().speed + 1,
        });
    }
}