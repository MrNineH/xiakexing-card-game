/*********************
 * 游戏核心系统初始化
 *********************/
import { cardDatabase, buffs } from './config.js';
import Player from './player.js';
import { CardSystem } from './cardSystem.js';
import { BattleSystem } from './battleSystem.js';
import { PackUI } from './ui/packUI.js';
import { DeckBuilderUI } from './ui/deckBuilderUI.js';

// 全局游戏状态
const cardSystem = new CardSystem();
const battleSystem = new BattleSystem();
const gameState = {
    currentPackCards: [],
    selectedCards: [],
    currentGender : '',
    player,
    library : [],
    discardPile : [],
    playerHand : [],
  };

/*********************
 * 界面交互函数
 *********************/
function selectGender(gender) {
    currentGender = gender;
    document.querySelectorAll('.gender-select button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.gender === gender) {
            btn.classList.add('active');
        }
    });
}

/*********************
 * 卡牌选择逻辑
 *********************/

function selectCard(cardElement, cardName) {
    const isSelected = cardElement.classList.contains('selected');
    
    if (isSelected) {
        // 取消选择
        cardElement.classList.remove('selected');
        selectedCards = selectedCards.filter(c => c.id !== cardElement.dataset.cardId);
        updateSelectionStatus();
    } else {
        // 检查是否重复
        if (selectedCards.length >= 10) {
            alert("已选择10张卡牌，可以组成牌组了！");
            return;
        }
        
        // 添加唯一ID标识
        const cardId = Date.now() + Math.random().toString(36).substr(2, 9);
        cardElement.dataset.cardId = cardId;
        cardElement.classList.add('selected');
        selectedCards.push({ id: cardId, name: cardName });
    }
    
    updateCardStates();
    updateSelectionStatus();
}   

/*********************
 * 新增卡牌状态更新
 *********************/
function updateCardStates() {
    document.querySelectorAll('.pack-card').forEach(card => {
        const cardId = card.dataset.cardId;
        const isSelected = selectedCards.some(c => c.id === cardId);
        card.classList.toggle('selected', isSelected);
        card.querySelector('.select-btn').textContent = isSelected ? "取消选择" : "加入牌组";
    });
}

/**
 * 更新卡牌选择状态信息
 * 该函数用于更新界面上显示的已选卡牌数量，并根据已选卡牌数量决定确认牌组按钮的可用状态。
 */
function updateSelectionStatus() {
    document.getElementById("selectedCount").textContent = selectedCards.length;
    document.getElementById("confirmDeckBtn").disabled = selectedCards.length < 10;
}

/*********************
 * 角色创建流程
 *********************/
function createCharacter() {
    try {
        const nickname = document.getElementById("nickname").value.trim();
        if (!nickname) {
            alert("请输入昵称");
            return;
        }
        
        // 初始化玩家
        player = new Player();
        player.nickname = nickname;
        player.gender = currentGender;
        player.deck = [];
        selectedCards = [];
        
        // 切换界面
        document.getElementById("loginPanel").style.display = "none";
        document.getElementById("packOpenPanel").style.display = "block";
        document.getElementById("packCards").innerHTML = ""; // 清空卡牌显示
    } catch (error) {
        console.error("角色创建失败：", error);
    }
}

/*********************
 * 游戏核心逻辑
 *********************/
function initDeck() {
    library = selectedCards.map((name, index) => ({
        id: Date.now() + index,
        name,
        ...cardDatabase[name]
    }));
    shuffleDeck();
    updateDeckInfo();
}

function shuffleDeck() {
    library.sort(() => Math.random() - 0.5);
}

/*********************
 * 牌组初始化逻辑
 *********************/
function startGame() {
    // 转换存储格式：{id: "card-123", name: "拳打"} → "拳打"
    player.deck = selectedCards.map(c => c.name);
    initDeck();
    drawCards(3);
}

/*********************
 * 事件绑定与初始化
 *********************/
function bindEvents() {
    // 性别选择
    document.querySelectorAll('.gender-select button').forEach(btn => {
        btn.addEventListener('click', () => selectGender(btn.dataset.gender));
    });

    // 创建角色
    document.getElementById("createCharacterBtn").addEventListener("click", createCharacter);

    // 开启卡包
    document.getElementById("openPackBtn").addEventListener("click", () => {
        gameState.currentPackCards = PackUI.generateStarterPack();
        PackUI.renderCards(document.getElementById("packCards"), gameState.currentPackCards);
        document.getElementById("openPackBtn").disabled = true;
        bindCardEvents();
    });

    // 确认牌组
    document.getElementById("confirmDeckBtn").addEventListener("click", () => {
        if (selectedCards.length < 10) {
            alert("至少需要选择10张卡牌！");
            return;
        }
        document.getElementById("packOpenPanel").style.display = "none";
        document.getElementById("gamePanel").style.display = "block";
        startGame();
    });
}

// 初始化游戏
bindEvents();