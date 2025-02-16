/*********************
 * 游戏核心系统初始化
 *********************/
import { cardDatabase, buffs } from './config.js';
import Player from './player.js';
import { CardSystem } from './cardSystem.js';
import { BattleSystem } from './battleSystem.js';

// 全局游戏状态
let currentGender = '';
let player;
let library = [];
let discardPile = [];
let playerHand = [];
let currentPackCards = [];
let selectedCards = [];
const cardSystem = new CardSystem();
const battleSystem = new BattleSystem();

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
 * 卡牌生成与渲染
 *********************/
function generateStarterPack() {
    const baseCards = ["拳打", "吐纳", "化瘀", "飞蝗石"];
    const martialArts = ["折风剑法", "披挂刀法", "猛虎拳法", "直冲枪法"];
    
    return [
        ...Array.from({length: 4}, () => baseCards[Math.floor(Math.random()*baseCards.length)]),
        martialArts[Math.floor(Math.random()*martialArts.length)]
    ];
}

function renderPackCards() {
    const container = document.getElementById("packCards");
    container.innerHTML = currentPackCards.map(card => `
        <div class="pack-card" data-card="${card}">
            <div class="card-header">${card}</div>
            <div class="card-effect">${cardDatabase[card]?.effect || '效果未定义'}</div>
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

/*********************
 * 卡牌选择逻辑
 *********************/
function selectCard(cardName) {
    if (selectedCards.includes(cardName)) {
        alert("该卡牌已被选择，不可重复添加！");
        return;
    }

    if (selectedCards.length >= 10) {
        alert("已选择10张卡牌，可以组成牌组了！");
        return;
    }

    selectedCards.push(cardName);
    player.deck = [...selectedCards];
    updateSelectionStatus();
    document.querySelector(`[data-card="${cardName}"]`).classList.add("selected");
}

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

function startGame() {
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
        currentPackCards = generateStarterPack();
        renderPackCards();
        document.getElementById("openPackBtn").disabled = true;
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