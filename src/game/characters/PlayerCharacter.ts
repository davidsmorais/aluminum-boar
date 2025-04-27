import { BaseCharacter, BaseStats } from "./BaseCharacter";

export class PlayerCharacter extends BaseCharacter {
    private name: string;
    private level: number;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(name: string, level: number, stats: BaseStats, sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        super(stats);
        this.name = name;
        this.level = level;
        this.sprite = sprite;
    }

    createAnimations(scene: Phaser.Scene, asepriteKey: string): void {
        scene.anims.createFromAseprite(asepriteKey);
    }

    focusCamera(scene: Phaser.Scene): void {
        scene.cameras.main.startFollow(this.sprite, true, 0.1, 0.1);
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