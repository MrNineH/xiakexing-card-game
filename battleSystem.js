export class BattleSystem { // 添加export关键字
    constructor() {
        this.isPlayerTurn = true;
    }

    processEnemyTurn() {
        return new Promise(resolve => {
            setTimeout(() => {
                // 敌人AI逻辑
                resolve();
            }, 1000);
        });
    }
}