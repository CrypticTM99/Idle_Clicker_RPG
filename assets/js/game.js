// === Global Variables ===
let gold = 0;
let totalClicks = 0;
let currentEnemy = 0;
let defeatedEnemies = 0;
let goldPerClick = 1;
let enemyHP = 100;
let playerXP = 0;
let playerLevel = 1;
let tavernUpgrades = { goldBoost: 1, heroBoost: 1 };  // Tavern upgrades
let heroes = [];

// === Enemy Data ===
const enemies = [
    { name: "Monster", hp: 100, img: "assets/images/enemies/enemy1.png", reward: 80 },
    { name: "Goblin", hp: 200, img: "assets/images/enemies/enemy2.png", reward: 250 },
    { name: "Ogre", hp: 400, img: "assets/images/enemies/enemy3.png", reward: 360 },
    { name: "Monster4", hp: 600, img: "assets/images/enemies/enemy4.png", reward: 500 },
    { name: "Ogre", hp: 800, img: "assets/images/enemies/enemy5.png", reward: 600 },
    // Add more enemies as needed...
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

// === Game Initialization ===
function initializeGame() {
    initializeQuests();
    initializeSkills();
    initializeTavernUpgrades(); // Initialize Tavern Upgrades
    updateEnemyDisplay();
    updateUI();

    // Add event listener for gold ore image
    const goldOreImage = document.getElementById("gold-ore");
    goldOreImage.addEventListener("click", handleGoldOreClick);
}

// === Gold Ore Click Handler ===
function handleGoldOreClick() {
    // Increment gold per click
    gold += goldPerClick * tavernUpgrades.goldBoost; // Apply gold boost from Tavern upgrades
    
    // Update UI
    document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;
    
    // Check for quests progress
    updateQuestProgress();
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

// === Update UI ===
function updateUI() {
    document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;
    document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHP}`;
    checkForHeroes();
    updateQuestProgress();
    updateTavernUpgrades(); // Update Tavern Upgrades UI
    updatePlayerLevel();
    updateXPDisplay(); // Update XP display
}

// === Update Player Level ===
function updatePlayerLevel() {
    document.getElementById("player-level").innerText = `Level: ${playerLevel} - XP: ${playerXP}`;
}

// === Update XP Display ===
function updateXPDisplay() {
    document.getElementById("player-xp").innerText = `XP: ${playerXP}`;
}

// === Enemy Click Logic ===
document.getElementById("enemy-image").addEventListener("click", () => {
    if (enemyHP <= 0) return;
    enemyHP -= goldPerClick * tavernUpgrades.heroBoost; // Apply hero boost from Tavern upgrades

    totalClicks++;

    if (enemyHP <= 0) {
        enemyHP = 0;
        document.getElementById("enemy-health").innerText = `Enemy Health: 0`;
        handleEnemyDefeat();
    } else {
        document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHP}`;
    }

    updateQuestProgress();
});

// === Enemy Defeat ===
function handleEnemyDefeat() {
    defeatedEnemies++;
    gold += enemies[currentEnemy].reward * tavernUpgrades.goldBoost; // Apply gold boost from Tavern upgrades
    playerXP += enemies[currentEnemy].reward * 0.1; // Increase XP by a fraction of the enemy reward

    // Level up if XP threshold is reached
    if (playerXP >= playerLevel * 100) {
        playerLevel++;
        playerXP = 0; // Reset XP for next level
    }

    document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;
    document.getElementById("player-level").innerText = `Level: ${playerLevel} - XP: ${playerXP}`;

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
    const questItem = document.getElementById(`quest-${index}`);
    questItem.innerText = `${quest.description} - Completed! Reward: ${quest.reward} Gold`;
    updateUI();
}

// === Heroes Management ===
function checkForHeroes() {
    const heroesList = document.getElementById("heroes-list");
    heroesList.innerHTML = "";

    heroData.forEach((hero, index) => {
        if (gold >= hero.cost) {
            const button = document.createElement("button");
            button.innerText = `${hero.name} (Cost: ${hero.cost} Gold)`;
            button.onclick = () => {
                if (gold >= hero.cost) {
                    gold -= hero.cost;
                    hero.level++;
                    heroes.push(hero);
                    updateUI();
                }
            };
            heroesList.appendChild(button);
        }
    });
}

// === Auto Collect Gold from Heroes ===
function collectGoldFromHeroes() {
    heroes.forEach(hero => {
        gold += hero.goldPerSecond * hero.level;
        document.getElementById("gold-display").innerText = `💰 Gold: ${gold}`;
    });
}

// === Main Game Loop ===
setInterval(() => {
    collectGoldFromHeroes();
    updateUI();
}, 1000);

// === Start the Game ===
initializeGame();
