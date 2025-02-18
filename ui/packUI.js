/**
 * 卡包开启界面模块
 * 功能：处理初始卡包生成、卡牌渲染、选择交互
 */
export class PackUI {
    static generateStarterPack() {
      const baseCards = ["拳打", "吐纳", "化瘀", "飞蝗石"];
      const martialArts = ["折风剑法", "披挂刀法", "猛虎拳法", "直冲枪法"];
      return [
        ...Array.from({ length: 4 }, () => 
          baseCards[Math.floor(Math.random() * baseCards.length)]),
        martialArts[Math.floor(Math.random() * martialArts.length)]
      ];
    }
  
    static renderCards(container, cards) {
      container.innerHTML = cards.map((card, index) => `
        <div class="pack-card" data-card="${card}" data-card-id="${Date.now()}-${index}">
          <div class="card-header">${card}</div>
          <div class="card-effect">${cardDatabase[card]?.effect || '效果未定义'}</div>
          <button class="select-btn">加入牌组</button>
        </div>
      `).join("");
    }
  }