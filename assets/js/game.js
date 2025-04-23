// === Global Variables ===
let gold = 0;
let totalClicks = 0;
let currentEnemy = 0;
let defeatedEnemies = 0;
let goldPerClick = 1;
let enemyHP = 100;
let playerXP = 0;
let playerLevel = 1;
let tavernUpgrades = { goldBoost: 1, heroBoost: 1 }; // Tavern upgrades
let heroes = [];
let heroTally = {}; // Tracks hero purchases

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

// === Game Initialization ===
function initializeGame() {
    initializeQuests();
    initializeSkills();
    initializeTavernUpgrades(); // Initialize Tavern upgrades
    updateEnemyDisplay();
    updateUI();

    // Add event listener for gold ore image
    const goldOreImage = document.getElementById("gold-ore.png");
    if (goldOreImage) {
        goldOreImage.addEventListener("click", handleGoldOreClick);
    }
}

// === Gold Ore Click Handler ===
function handleGoldOreClick() {
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

    // Update hero tally display
    const heroTallyContainer = document.getElementById("hero-tally");
    heroTallyContainer.innerHTML = Object.entries(heroTally)
        .map(([heroName, count]) => `<div>${heroName}: ${count}</div>`)
        .join("");
    heroTallyContainer.style.display = Object.keys(heroTally).length > 0 ? "block" : "none";

    checkForHeroes();
    updateQuestProgress();
    updateTavernUpgrades(); // Update Tavern upgrades UI
    updatePlayerLevel();
    updateXPDisplay(); // Update XP display
}

// === Heroes Management ===
function checkForHeroes() {
    const heroesList = document.getElementById("heroes-list");
    heroesList.innerHTML = "";

    heroData.forEach((hero) => {
        if (gold >= hero.cost) {
            const button = document.createElement("button");
            button.innerText = `${hero.name} (Cost: ${hero.cost} Gold)`;
            button.onclick = () => {
                if (gold >= hero.cost) {
                    gold -= hero.cost;
                    hero.level++;
                    heroes.push(hero);

                    // Update hero tally
                    if (!heroTally[hero.name]) {
                        heroTally[hero.name] = 0;
                    }
                    heroTally[hero.name]++;

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

// === Apply Idle Damage ===
function applyIdleDamage() {
    heroes.forEach(hero => {
        if (enemyHP > 0) {
            enemyHP -= hero.idleDamage * hero.level;  // Heroes deal idle damage based on their level
        }
    });
    document.getElementById("enemy-health").innerText = `Enemy Health: ${Math.max(0, enemyHP)}`;
}

// === Main Game Loop ===
setInterval(() => {
    collectGoldFromHeroes();
    applyIdleDamage(); // Apply idle damage from heroes
    updateUI();
}, 1000);

// === Start the Game ===
initializeGame();
