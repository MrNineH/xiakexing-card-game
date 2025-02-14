class Player {
    constructor() {
        this.nickname = "";
        this.gender = "male";
        this.hp = 10;
        this.maxHp = 10;
        this.neili = 0;
        this.deck = [];
        this.packs = [];
        this.buffSystem = new BuffSystem();
    }

    saveToLocal() {
        localStorage.setItem("playerData", JSON.stringify(this));
    }
}