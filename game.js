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
    { name: "Ogre", hp: 800, img: "assets/images/enemies/enemy5.png", reward: 600 },
];

let enemyHP = enemies[currentEnemy].hp;

const heroData = [
    { name: "Swordman", cost: 100, goldPerSecond: 5, idleDamage: 5, xp: 0, level: 1 },
    { name: "Archer", cost: 400, goldPerSecond: 10, idleDamage: 14, xp: 0, level: 1 },
    { name: "Mage", cost: 600, goldPerSecond: 20, idleDamage: 28, xp: 0, level: 1 },
];

const skillData = [
    { name: "Pick Up the Sword", cost: 0, effect: () => { goldPerClick += 1; } },
    { name: "Double Gold", cost: 50, effect: () => { goldPerClick *= 2; } },
    { name: "2x Attack for Heroes", cost: 350, effect: () => { goldPerClick *= 5; } },
];

const questData = [
    { description: "Click 10 times", progress: 0, target: 10, reward: 50, complete: false },
    { description: "Defeat 5 enemies", progress: 0, target: 5, reward: 100, complete: false },
    { description: "Defeat 20 enemies", progress: 0, target: 20, reward: 200, complete: false },
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
    questItem.classList.add("complete");
    questItem.innerText = `${quest.description} - ✅ Complete!`;
    fadeOutQuest(questItem);
    updateUI();
}

function fadeOutQuest(element) {
    setTimeout(() => {
        element.style.transition = "opacity 2s";
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.display = "none";
        }, 2000);
    }, 1000);
}

// === Skills ===
function initializeSkills() {
    const skillContainer = document.getElementById("skill-list");
    skillContainer.innerHTML = "";
    skillData.forEach((skill) => {
        const button = document.createElement("button");
        button.innerText = `${skill.name} (${skill.cost} gold)`;
        button.onclick = () => {
            if (gold >= skill.cost) {
                gold -= skill.cost;
                skill.effect();
                button.disabled = true;
                updateUI();
            }
        };
        skillContainer.appendChild(button);
    });
}

// === Heroes ===
function checkForHeroes() {
    const container = document.getElementById("hero-buttons");
    container.innerHTML = "";

    heroData.forEach((hero) => {
        if (!heroes.includes(hero.name) && gold >= hero.cost) {
            const button = document.createElement("button");
            button.innerText = `Hire ${hero.name} (${hero.cost} gold)`;
            button.onclick = () => buyHero(hero);
            container.appendChild(button);
        } else if (heroes.includes(hero.name)) {
            const upgradeButton = document.createElement("button");
            upgradeButton.innerText = `${hero.name} Level: ${hero.level} (Upgrade)`;
            upgradeButton.onclick = () => upgradeHero(hero);
            container.appendChild(upgradeButton);
        }
    });
}

function buyHero(hero) {
    if (gold >= hero.cost) {
        gold -= hero.cost;
        heroes.push(hero.name);
        startHeroIdleGeneration(hero);
        startHeroIdleDamage(hero);
        updateUI();
    }
}

function upgradeHero(hero) {
    const heroToUpgrade = heroData.find(h => h.name === hero.name);
    if (heroToUpgrade && gold >= heroToUpgrade.cost * heroToUpgrade.level) {
        gold -= heroToUpgrade.cost * heroToUpgrade.level;
        heroToUpgrade.level += 1;
        heroToUpgrade.goldPerSecond *= 1.5;  // Boost gold generation with each upgrade
        heroToUpgrade.idleDamage *= 1.5;  // Boost idle damage with each upgrade
        updateUI();
    }
}

function startHeroIdleGeneration(hero) {
    setInterval(() => {
        gold += hero.goldPerSecond;
        updateUI();
    }, 1000);
}

function startHeroIdleDamage(hero) {
    setInterval(() => {
        if (enemyHP > 0) {
            enemyHP -= hero.idleDamage * tavernUpgrades.heroBoost;  // Apply hero damage boost
            if (enemyHP <= 0) {
                enemyHP = 0;
                handleEnemyDefeat();
            }
            updateUI();
        }
    }, 1000);
}

// === Manual Click for Gold Ore ===
function generateGold() {
    gold += goldPerClick * tavernUpgrades.goldBoost;  // Apply gold boost
    totalClicks++;
    updateUI();
}

// === Player Level-Up ===
function checkPlayerLevelUp() {
    if (playerXP >= playerLevel * 10) {
        playerLevel++;
        goldPerClick += 2;  // Increase gold per click on level up
        playerXP = 0;  // Reset XP
        updateUI();
    }
}

// === Credit ===
document.getElementById("footer").innerText = "Created by CrypticTM";

// === Start the Game ===
window.onload = initializeGame;
