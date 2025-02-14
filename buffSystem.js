// buffSystem.js
export default class BuffSystem {
    constructor() {
        this.buffs = [];
    }

    addBuff(buff) {
        this.buffs.push({
            name: buff.name,
            duration: buff.duration,
            effects: buff.effects
        });
    }

    processTurnEnd() {
        this.buffs = this.buffs.filter(buff => {
            buff.duration -= 1;
            return buff.duration > 0;
        });
    }

    getEffectModifier(effectType) {
        return this.buffs.reduce((sum, buff) => {
            return sum + (buff.effects[effectType] || 0);
        }, 0);
    }
}