// ========== 游戏核心系统 ==========
let library = [];     // 牌组库
let discardPile = []; // 弃牌堆
let playerHand = [];  // 玩家手牌
let playerNeili = 0;  // 玩家内力
let isPlayerTurn = true;
let currentGender = 'male';

function initGame() {
    player = new Player(); // 确保player实例化
    if (localStorage.getItem("playerData")) {
        player.loadFromLocal();
    }
    bindEvents();
}

import { cardDatabase, buffs } from './config.js';
import Player from './player.js';
import CardSystem from './cardSystem.js';
import BattleSystem from './battleSystem.js';

const player = new Player();
const cardSystem = new CardSystem();
const battleSystem = new BattleSystem();

function initGame() {
    if (localStorage.getItem("playerData")) {
        player.loadFromLocal();
    }
    bindEvents();
}

const cardEffectHandlers = {
    '拳打': (source, target) => {
        target.hp -= 1 + source.buffSystem.getEffectModifier('attack');
    },
    '折风剑法': (source, target) => {
        source.buffSystem.addBuff(buffs.神速);
        target.hp -= 1;
    }
};

function selectGender(gender) {
    currentGender = gender;
    document.querySelectorAll('.gender-select button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}
// 初始化新玩家
function initNewPlayer() {
    player.packs = Array(5).fill("初入江湖");
    player.deck = [];
    player.saveToLocal();
}

function bindEvents() {
    // 性别选择按钮
    document.querySelectorAll('.gender-select button').forEach(btn => {
        btn.addEventListener('click', function() {
            selectGender(this.dataset.gender);
        });
    });
    
    // 初始化时调用
    initGame();
}

function openStarterPack() {
    const packCards = [];
    // 每个卡包固定包含
    const baseCards = ["拳打", "脚踢", "吐纳", "化瘀", "飞蝗石"];
    const martialArts = ["折风剑法", "披挂刀法", "猛虎拳法", "直冲枪法"];
    
    // 抽5张基础牌 + 1张随机武学牌
    for(let i=0; i<5; i++) {
        packCards.push(baseCards[Math.floor(Math.random()*baseCards.length)]);
    }
    packCards.push(martialArts[Math.floor(Math.random()*martialArts.length)]);
    
    // 展示抽卡结果
    const container = document.getElementById("packCards");
    container.innerHTML = packCards.map(card => `
        <div class="pack-card" data-card="${card}">  // 添加data-card属性
            <div>${card}</div>
            <button onclick="selectCard('${card}')">加入牌组</button>
        </div>
    `).join("");
}

function selectCard(cardName) {
    if(player.deck.length < 30) {
        player.deck.push(cardName);
        document.querySelector(`[data-card='${cardName}']`).classList.add("selected");
    }
}

// 创建角色后执行
function createCharacter() {
    if (!document.getElementById("nickname").value) {
        alert("请输入昵称");
        return;
    }
    
    player = {
        ...player,
        nickname: document.getElementById("nickname").value,
        gender: currentGender
    };
    
    document.getElementById("loginPanel").style.display = "none";
    document.getElementById("packOpenPanel").style.display = "block";
    openStarterPack();
}

// 确认牌组后开始游戏
function confirmDeck() {
    if(player.deck.length < 10) {
        alert("牌组至少需要10张卡牌！");
        return;
    }
    document.getElementById("packOpenPanel").style.display = "none";
    document.getElementById("gamePanel").style.display = "block";
    initDeck(player.deck); // 使用玩家选择的牌组初始化
}

// ========== 初始化游戏 ==========
function initDeck() {
    library = player.deck.map((name, index) => ({
        id: Date.now() + index,
        name: name,
        ...cardDatabase[name]
    }));
    shuffleDeck();
    updateDeckInfo();
}

function shuffleDeck() {
    library.sort(() => Math.random() - 0.5);
}

// ========== 卡牌操作 ==========
function drawCards(num = 3) {
    if (library.length < num) {
        library.push(...discardPile);
        discardPile = [];
        shuffleDeck();
    }
    const drawnCards = library.splice(0, num);
    playerHand.push(...drawnCards);
    renderHand();
    updateDeckInfo();
}

function playCard(cardIndex) {
    const card = playerHand[cardIndex];
    // 处理效果
    if(cardDatabase[card.name].effect === "damage") {
        document.getElementById("enemyHp").textContent = 
            parseInt(document.getElementById("enemyHp").textContent) - 1;
    }
    // 移动到弃牌堆
    discardPile.push(card);
    playerHand.splice(cardIndex, 1);
    // 更新界面
    renderHand();
    checkGameOver();
    updateDeckInfo();
}
//状态系统
class BuffSystem {
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

// ========== 界面更新 ==========
function renderHand() {
    const handArea = document.querySelector(".hand");
    handArea.innerHTML = "";
    playerHand.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.textContent = card.name;
        cardElement.addEventListener("click", () => playCard(index));
        handArea.appendChild(cardElement);
    });
}

function updateDeckInfo() {
    document.getElementById("libraryCount").textContent = library.length;
    document.getElementById("discardCount").textContent = discardPile.length;
}

// ========== 回合系统 ==========
document.getElementById("endTurnBtn").addEventListener("click", endTurn);

function endTurn() {
    isPlayerTurn = false;
    discardHand();
    
    setTimeout(() => {
        // 敌人行动
        document.getElementById("hp").textContent = 
            parseInt(document.getElementById("hp").textContent) - 1;
        checkGameOver();
        
        // 切换回合
        isPlayerTurn = true;
        drawCards(3);
    }, 1000);
}

function discardHand() {
    discardPile.push(...playerHand);
    playerHand = [];
    renderHand();
    updateDeckInfo();
}

// ========== 游戏状态检测 ==========
function checkGameOver() {
    const playerHp = parseInt(document.getElementById("hp").textContent);
    const enemyHp = parseInt(document.getElementById("enemyHp").textContent);
    
    if (playerHp <= 0) {
        alert("败北！武侠之路尚未完结...");
        location.reload();
    }
    if (enemyHp <= 0) {
        alert("胜利！你已成为一代大侠！");
        location.reload();
    }
}

// ========== 初始化游戏 ==========
document.getElementById("drawBtn").addEventListener("click", () => drawCards(3));
initDeck();
drawCards(3);

window.selectGender = selectGender;
window.createCharacter = createCharacter;
window.selectCard = selectCard;