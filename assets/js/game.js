
// === Global Variables ===
let gold = 0;
let totalClicks = 0;
let currentEnemy = 0;
let defeatedEnemies = 0;
let goldPerClick = 1;
let enemyHP = 100;
let playerXP = 0;
let playerLevel = 1;
let tavernUpgrades = { goldBoost: 1, heroBoost: 1 };
let heroes = [];
let quests = [];

// === Enemy Data ===
const enemies = [
    { name: "Monster", hp: 100, img: "assets/images/enemies/enemy1.png", reward: 80 },
    { name: "Goblin", hp: 200, img: "assets/images/enemies/enemy2.png", reward: 250 },
    { name: "Ogre", hp: 400, img: "assets/images/enemies/enemy3.png", reward: 360 },
    { name: "Monster4", hp: 600, img: "assets/images/enemies/enemy4.png", reward: 500 },
    { name: "Ogre", hp: 800, img: "assets/images/enemies/enemy5.png", reward: 600 },
];

// === Hero Data ===
const heroData = [
    { name: "Swordman", cost: 100, goldPerSecond: 5, idleDamage: 5, xp: 0, level: 1 },
    { name: "Archer", cost: 400, goldPerSecond: 10, idleDamage: 14, xp: 0, level: 1 },
    { name: "Mage", cost: 600, goldPerSecond: 20, idleDamage: 28, xp: 0, level: 1 },
    { name: "Swashbuckler", cost: 1200, goldPerSecond: 45, idleDamage: 36, xp: 0, level: 2 },
    { name: "TBD", cost: 1800, goldPerSecond: 120, idleDamage: 48, xp: 0, level: 1 },
];

// === Skill Data ===
const skillData = [
    { name: "Pick Up the Sword", cost: 0, effect: () => { goldPerClick += 1; } },
    { name: "Double Gold", cost: 50, effect: () => { goldPerClick *= 2; } },
    { name: "2x Attack for Heroes", cost: 350, effect: () => { goldPerClick *= 5; } },
    { name: "Liam Neeson's Swag", cost: 550, effect: () => { goldPerClick *= 4; } },
];

// === Quest Data ===
const questData = [
    { description: "Click 10 times", progress: 0, target: 10, reward: 50, complete: false },
    { description: "Defeat 5 enemies", progress: 0, target: 5, reward: 100, complete: false },
    { description: "Defeat 20 enemies", progress: 0, target: 20, reward: 200, complete: false },
];

// === Tavern Upgrades ===
const tavernUpgradesData = [
    { name: "Gold Boost", cost: 200, effect: () => { tavernUpgrades.goldBoost *= 2; } },
    { name: "Hero Boost", cost: 500, effect: () => { tavernUpgrades.heroBoost *= 2; } },
];

function initializeGame() {
    initializeQuests();
    updateEnemyDisplay();
    updateUI();
    initializeTavernUpgrades();

    document.getElementById("gold-ore").addEventListener("click", handleGoldOreClick);
    document.getElementById("enemy-image").addEventListener("click", handleEnemyClick);
}

function handleGoldOreClick() {
    gold += goldPerClick * tavernUpgrades.goldBoost;
    totalClicks++;
    updateQuestProgress();
    updateUI();
}

function handleEnemyClick() {
    if (enemyHP <= 0) return;
    enemyHP -= goldPerClick * tavernUpgrades.heroBoost;
    if (enemyHP <= 0) {
        handleEnemyDefeat();
    }
    updateUI();
}

function handleEnemyDefeat() {
    defeatedEnemies++;
    gold += enemies[currentEnemy].reward * tavernUpgrades.goldBoost;
    currentEnemy = (currentEnemy + 1) % enemies.length;
    updateEnemyDisplay();
}

function updateEnemyDisplay() {
    const enemy = enemies[currentEnemy];
    enemyHP = enemy.hp;
    document.getElementById("enemy-image").src = enemy.img;
}

function initializeQuests() {
    quests = JSON.parse(JSON.stringify(questData));
    const questList = document.getElementById("quest-list");
    questList.innerHTML = "";
    quests.forEach((quest, index) => {
        const div = document.createElement("div");
        div.id = `quest-${index}`;
        div.innerText = quest.description;
        questList.appendChild(div);
    });
}

function updateQuestProgress() {
    quests.forEach((quest, index) => {
        if (!quest.complete) {
            if (quest.description.includes("Click") && totalClicks >= quest.target) {
                completeQuest(quest, index);
            } else if (quest.description.includes("Defeat") && defeatedEnemies >= quest.target) {
                completeQuest(quest, index);
            }
        }
    });
}

function completeQuest(quest, index) {
    quest.complete = true;
    gold += quest.reward;
    document.getElementById(`quest-${index}`).innerText = `${quest.description} - Completed! Reward: ${quest.reward}`;
}

function initializeTavernUpgrades() {
    const container = document.getElementById("tavern-upgrades-list");
    container.innerHTML = "";
    tavernUpgradesData.forEach(upgrade => {
        const button = document.createElement("button");
        button.innerText = `${upgrade.name} (${upgrade.cost} gold)`;
        button.onclick = () => {
            if (gold >= upgrade.cost) {
                gold -= upgrade.cost;
                upgrade.effect();
                button.disabled = true;
                updateUI();
            }
        };
        container.appendChild(button);
    });
}

function updateUI() {
    document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;
    document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHP}`;
    document.getElementById("player-level").innerText = `Level: ${playerLevel} - XP: ${playerXP}`;
}

// === Auto Gold from Heroes ===
function collectGoldFromHeroes() {
    heroes.forEach(hero => {
        gold += hero.goldPerSecond * hero.level;
    });
    updateUI();
}

// === Main Game Loop ===
setInterval(() => {
    collectGoldFromHeroes();
}, 1000);

initializeGame();
