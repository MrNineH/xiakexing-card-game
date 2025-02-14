// player.js
import BuffSystem from './buffSystem.js'; // 新增导入

export default class Player {
    constructor() {
        this.nickname = "";
        this.gender = "male";
        this.hp = 10;
        this.maxHp = 10;
        this.neili = 0;
        this.deck = [];
        this.packs = [];
        this.buffSystem = new BuffSystem(); // 现在可以正确引用
    }

    saveToLocal() {
        localStorage.setItem("playerData", JSON.stringify(this));
    }

    loadFromLocal() {
        const data = JSON.parse(localStorage.getItem("playerData"));
        Object.assign(this, data);
    }
}