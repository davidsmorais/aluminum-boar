export interface BaseStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

export class BaseCharacter {
    protected stats: BaseStats;

    constructor(stats: BaseStats) {
        this.stats = stats;
    }

    getStats(): BaseStats {
        return this.stats;
    }

    updateStats(newStats: Partial<BaseStats>): void {   
        this.stats = { ...this.stats, ...newStats };
    }

    isAlive(): boolean {
        return this.stats.health > 0;
    }

    takeDamage(damage: number): void {
        this.stats.health -= damage;
        if (this.stats.health < 0) {
            this.stats.health = 0;
        }
    }

}