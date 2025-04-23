// === Global Variables ===
let gold = 0;
let quests = [];
let heroes = [];
let currentEnemy = 0;
let goldPerClick = 1;
let totalClicks = 0;
let tavernUpgrades = { goldBoost: 1, heroBoost: 1 };  // Tavern upgrades
let playerXP = 0;
let playerLevel = 1;

const enemies = [
    { name: "Monster", hp: 100, img: "assets/images/enemies/enemy1.png", reward: 80 },
    { name: "Goblin", hp: 200, img: "assets/images/enemies/enemy2.png", reward: 250 },
    { name: "Ogre", hp: 400, img: "assets/images/enemies/enemy3.png", reward: 360 },
    { name: "Monster4", hp: 600, img: "assets/images/enemies/enemy4.png", reward: 500 },
    { name: "Monster5", hp: 800, img: "assets/images/enemies/enemy5.png", reward: 600 },
    { name: "Monster6", hp: 1000, img: "assets/images/enemies/enemy5.png", reward: 600 },
    { name: "Monster7", hp: 1400, img: "assets/images/enemies/enemy6.png", reward: 600 },
    { name: "Monster8", hp: 1800, img: "assets/images/enemies/enemy7.png", reward: 600 },
    { name: "Monster9", hp: 2200, img: "assets/images/enemies/enemy8.png", reward: 600 },
    { name: "Monster10", hp: 2800, img: "assets/images/enemies/enemy9.png", reward: 600 },
    { name: "Monster11", hp: 3200, img: "assets/images/enemies/enemy10.png", reward: 600 },
    { name: "Monster12", hp: 3800, img: "assets/images/enemies/enemy11.png", reward: 600 },
    { name: "Monster13", hp: 4700, img: "assets/images/enemies/enemy12.png", reward: 600 },
    { name: "Monster14", hp: 5400, img: "assets/images/enemies/enemy13.png", reward: 600 },
    { name: "Monster15", hp: 6800, img: "assets/images/enemies/enemy14.png", reward: 600 },
    { name: "Monster16", hp: 7400, img: "assets/images/enemies/enemy15.png", reward: 600 },
];

let enemyHP = enemies[currentEnemy].hp;

const heroData = [
    { name: "Swordman", cost: 100, goldPerSecond: 5, idleDamage: 5, xp: 0, level: 1 },
    { name: "Archer", cost: 400, goldPerSecond: 10, idleDamage: 14, xp: 0, level: 1 },
    { name: "Mage", cost: 600, goldPerSecond: 20, idleDamage: 28, xp: 0, level: 1 },
    { name: "Swashbuckler", cost: 1200, goldPerSecond: 45, idleDamage: 36, xp: 0, level: 2 },
    { name: "TBD", cost: 1800, goldPerSecond: 120, idleDamage: 48, xp: 0, level: 1 },
];

const skillData = [
    { name: "Pick Up the Sword", cost: 0, effect: () => { goldPerClick += 1; } },
    { name: "Double Gold", cost: 50, effect: () => { goldPerClick *= 2; } },
    { name: "2x Attack for Heroes", cost: 350, effect: () => { goldPerClick *= 5; } },
    { name: "Liam neeson's swag", cost: 550, effect: () => { goldPerClick *= 4; } },
];

const questData = [
    { description: "Click 10 times", progress: 0, target: 10, reward: 50, complete: false },
    { description: "Defeat 5 enemies", progress: 0, target: 5, reward: 100, complete: false },
    { description: "Defeat 20 enemies", progress: 0, target: 20, reward: 200, complete: false },
    { description: "Click 50 times", progress: 0, target: 50, reward: 250, complete: false },
];

let defeatedEnemies = 0;

// === Tavern Upgrades Data ===
const tavernUpgradesData = [
    { name: "Gold Boost", cost: 200, effect: () => { tavernUpgrades.goldBoost *= 2; } },
    { name: "Hero Boost", cost: 500, effect: () => { tavernUpgrades.heroBoost *= 2; } },
];

// === Game Initialization ===
function initializeGame() {
    initializeQuests();
    initializeSkills();
    initializeTavernUpgrades();  // Initialize Tavern Upgrades
    updateEnemyDisplay();
    updateUI();
}

// === Tavern Upgrades ===
function initializeTavernUpgrades() {
    const tavernContainer = document.getElementById("tavern-upgrades-list");
    tavernContainer.innerHTML = "";

    tavernUpgradesData.forEach((upgrade) => {
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
        tavernContainer.appendChild(button);
    });
}

// === UI Updates ===
function updateUI() {
    document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;
    document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHP}`;
    document.getElementById("player-xp").innerText = `XP: ${playerXP}`;
    document.getElementById("player-level").innerText = `Level: ${playerLevel}`;
    checkForHeroes();
    updateQuestProgress();
    updateTavernUpgrades();  // Update Tavern Upgrades UI
}

// === Update Tavern Upgrades UI ===
function updateTavernUpgrades() {
    const tavernContainer = document.getElementById("tavern-upgrades-list");
    tavernContainer.innerHTML = "";

    tavernUpgradesData.forEach((upgrade) => {
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
        tavernContainer.appendChild(button);
    });
}

// === Enemy Click Logic ===
document.getElementById("enemy-image").addEventListener("click", () => {
    if (enemyHP <= 0) return;
    enemyHP -= goldPerClick * tavernUpgrades.heroBoost;  // Apply hero boost from Tavern upgrades

    totalClicks++;

    if (enemyHP <= 0) {
        enemyHP = 0;
        document.getElementById("enemy-health").innerText = `Enemy Health: 0`;
        handleEnemyDefeat();
    } else {
        document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHP}`;
    }

    // Grant XP to the player for every click
    playerXP += 1;
    checkPlayerLevelUp();

    updateQuestProgress();
});

// === Enemy Defeat ===
function handleEnemyDefeat() {
    defeatedEnemies++;
    gold += enemies[currentEnemy].reward * tavernUpgrades.goldBoost;  // Apply gold boost from Tavern upgrades
    document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;

    // Grant XP for enemy defeat
    playerXP += 5;
    checkPlayerLevelUp();

    const enemyImage = document.getElementById("enemy-image");
    enemyImage.style.transition = "opacity 0.5s ease";
    enemyImage.style.opacity = 0;

    setTimeout(() => {
        currentEnemy = (currentEnemy + 1) % enemies.length;
        updateEnemyDisplay();
    }, 500);
}

function updateEnemyDisplay() {
    const enemy = enemies[currentEnemy];
    enemyHP = enemy.hp;

    const enemyImage = document.getElementById("enemy-image");
    enemyImage.src = enemy.img;
    enemyImage.style.opacity = 1;

    document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHP}`;
}

// === Quests ===
function initializeQuests() {
    quests = [...questData];
    const questList = document.getElementById("quest-list");
    questList.innerHTML = "";
    quests.forEach((quest, index) => {
        const questItem = document.createElement("div");
        questItem.id = `quest-${index}`;
        questItem.innerText = quest.description;
        questList.appendChild(questItem);
    });
}

function updateQuestProgress() {
    quests.forEach((quest, index) => {
        if (!quest.complete) {
            quest.progress = calculateQuestProgress(quest);
            const questItem = document.getElementById(`quest-${index}`);
            questItem.innerText = `${quest.description} (Progress: ${quest.progress}/${quest.target})`;

            if (quest.progress >= quest.target) {
                quest.complete = true;
                questItem.innerText = `${quest.description} (Completed)`;
                gold += quest.reward;  // Reward gold for completing the quest
                updateUI();
            }
        }
    });
}

function calculateQuestProgress(quest) {
    if (quest.description.includes("Click")) {
        return totalClicks;
    } else if (quest.description.includes("Defeat")) {
        return defeatedEnemies;
    }
    return 0;
}

// === Hero Management ===
function checkForHeroes() {
    heroes.forEach((hero) => {
        if (gold >= hero.cost) {
            // Allow buying the hero when there's enough gold
            const button = document.createElement("button");
            button.innerText = `Hire ${hero.name} (${hero.cost} gold)`;
            button.onclick = () => {
                if (gold >= hero.cost) {
                    gold -= hero.cost;
                    hero.xp += 10;  // Add XP for hiring
                    updateUI();
                }
            };
            document.getElementById("hero-list").appendChild(button);
        }
    });
}

// === Player Level Up ===
function checkPlayerLevelUp() {
    if (playerXP >= playerLevel * 10) {
        playerLevel++;
        playerXP = 0;
        updateUI();
    }
}

// Start the game
initializeGame();
