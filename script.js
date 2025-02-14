/*********************
 * 游戏核心系统初始化
 *********************/
import { cardDatabase, buffs } from './config.js';
import Player from './player.js';
import { CardSystem } from './cardSystem.js';
import { BattleSystem } from './battleSystem.js';

// 全局游戏状态
let currentGender = '';  // 当前选择性别
let player;              // 玩家实例
let library = [];        // 牌组库
let discardPile = [];    // 弃牌堆
let playerHand = [];     // 手牌
const cardSystem = new CardSystem();
const battleSystem = new BattleSystem();

/*********************
 * 界面交互函数
 *********************/
function selectGender(gender) {
    currentGender = gender;
    const buttons = document.querySelectorAll('.gender-select button');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.gender === gender) {
            btn.classList.add('active');
            console.log(`已选择性别：${gender}`);
        }
    });
}

/*********************
 * 卡牌系统函数
 *********************/
let currentPackCards = []; // 当前卡包内容

function generateStarterPack() {
    const baseCards = ["拳打", "吐纳", "化瘀", "飞蝗石"];
    const martialArts = ["折风剑法", "披挂刀法", "猛虎拳法", "直冲枪法"];
    
    // 生成4张可重复的基础牌
    const packCards = [];
    for(let i=0; i<4; i++) {
        packCards.push(baseCards[Math.floor(Math.random()*baseCards.length)]);
    }
    
    // 添加1张随机武学牌
    packCards.push(martialArts[Math.floor(Math.random()*martialArts.length)]);
    
    return packCards;
}

function renderPackCards() {
    const container = document.getElementById("packCards");
    container.innerHTML = currentPackCards.map(card => `
        <div class="pack-card" data-card="${card}">
            <div class="card-name">${card}</div>
            <div class="card-effect">${cardDatabase[card].effect}</div>
            <button class="select-btn">加入牌组</button>
        </div>
    `).join("");

    // 绑定选择事件
    document.querySelectorAll('.select-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cardName = this.closest('.pack-card').dataset.card;
            selectCard(cardName);
        });
    });
}

function selectCard(cardName) {
    if (player.deck.length >= 10) {
        alert("已选择10张卡牌，可以组成牌组了！");
        return;
    }
    
    player.deck.push(cardName);
    document.querySelector(`[data-card="${cardName}"]`).classList.add("selected");
    document.getElementById("selectedCount").textContent = player.deck.length;
    
    // 启用确认按钮
    document.getElementById("confirmDeckBtn").disabled = player.deck.length < 10;
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
        
        // 生成并显示卡包
        currentPackCards = generateStarterPack();
        renderPackCards();
        
        // 切换界面
        document.getElementById("loginPanel").style.display = "none";
        document.getElementById("packOpenPanel").style.display = "block";
        
        console.log("卡包内容：", currentPackCards);
        
    } catch (error) {
        console.error("角色创建失败：", error);
        alert("发生未知错误，请刷新页面");
    }
}

/*********************
 * 游戏初始化
 *********************/
function initDeck() {
    library = player.deck.map((name, index) => ({
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

function startGame() {
    initDeck();
    drawCards(3);
    console.log("游戏开始！当前牌组：", library);
}

function bindEvents() {
    // 性别选择
    document.querySelectorAll('.gender-select button').forEach(btn => {
        btn.addEventListener('click', () => selectGender(btn.dataset.gender));
    });
    
    // 角色创建
    document.getElementById("createCharacterBtn").addEventListener("click", createCharacter);
    
    // 牌组确认
    document.getElementById("confirmDeckBtn").addEventListener("click", () => {
        if (player.deck.length < 10) {
            alert("至少需要选择10张卡牌！");
            return;
        }
        document.getElementById("packOpenPanel").style.display = "none";
        document.getElementById("gamePanel").style.display = "block";
        startGame();
    });
}

// 启动游戏
bindEvents();