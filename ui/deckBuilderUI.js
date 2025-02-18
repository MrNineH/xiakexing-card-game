/**
 * 牌组组建界面模块
 * 功能：处理已选卡牌展示、数量验证、状态同步
 */
export class DeckBuilderUI {
    static updateSelectionStatus(selectedCount) {
      document.getElementById("selectedCount").textContent = selectedCount;
      document.getElementById("confirmDeckBtn").disabled = selectedCount < 10;
    }
  
    static renderSelectedCards(container, selectedCards) {
      container.innerHTML = selectedCards.map(card => `
        <div class="selected-card">
          <span>${card.name}</span>
          <button class="remove-btn">移除</button>
        </div>
      `).join("");
    }
  }