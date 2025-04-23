// Define the global variables
//let gold = 0;
//let quests = [];
//let heroes = [];
//let enemyHealth = 100;
//let enemyDamage = 1; // Idle damage to the enemy

// Hero and Skill Data
const heroData = [
    { name: "Swordman", cost: 100, goldPerSecond: 5, idleDamage: 1 },
    { name: "Archer", cost: 200, goldPerSecond: 10, idleDamage: 2 },
    // Add more heroes as necessary
];

const skillData = [
    { name: "Pick Up the Sword", cost: 0, effect: () => { enemyDamage += 1; goldPerClick += 1; } },
    { name: "Double Gold", cost: 50, effect: () => { goldPerClick *= 2; } },
    // Add more skills as necessary
];

// Quest Data
const questData = [
    { description: "Click 10 times", progress: 0, target: 10, reward: 50, complete: false },
    { description: "Defeat 5 enemies", progress: 0, target: 5, reward: 100, complete: false },
    // Add more quests as necessary
];

// Handle quest updates
function updateQuestProgress() {
    quests.forEach((quest, index) => {
        if (!quest.complete) {
            if (quest.description.includes("Click")) {
                if (gold >= quest.target) {
                    quest.complete = true;
                    document.getElementById(`quest-${index}`).innerText = quest.description + " - Complete!";
                    fadeOutQuest(index);
                }
            } else if (quest.description.includes("Defeat")) {
                if (enemyHealth <= 0) {
                    quest.complete = true;
                    document.getElementById(`quest-${index}`).innerText = quest.description + " - Complete!";
                    fadeOutQuest(index);
                }
            }
        }
    });
}

// Fade out the quest
function fadeOutQuest(index) {
    setTimeout(() => {
        const questElement = document.getElementById(`quest-${index}`);
        questElement.style.transition = "opacity 2s";
        questElement.style.opacity = 0;
        setTimeout(() => {
            questElement.style.display = "none";
        }, 2000);
    }, 1000);
}

// Add hero if cost is met
//function checkForHeroes() {
//    heroData.forEach((hero, index) => {
//        if (gold >= hero.cost && !heroes.includes(hero.name)) {
  //          const heroButton = document.createElement("button");
 ///   //        heroButton.innerText = `Buy ${hero.name} for ${hero.cost} gold`;
        //    heroButton.onclick = () => buyHero(hero, index);
      //      document.getElementById("hero-buttons").appendChild(heroButton);
     //   }
   // });
}

// Buy a hero
//function buyHero(hero, index) {
  //  if (gold >= hero.cost) {
  //      gold -= hero.cost;
   //     heroes.push(hero.name);
   //     startHeroIdleGeneration(hero);
     //   startHeroIdleDamage(hero);
  //  }
//}

// Start generating gold from hero
//function startHeroIdleGeneration(hero) {
//    setInterval(() => {
 //       gold += hero.goldPerSecond;
//        updateUI();
 //   }, 1000);
}

// Start idle damage from hero
//function startHeroIdleDamage(hero) {
//    setInterval(() => {
//        enemyHealth -= hero.idleDamage;
//        updateUI();
  //      if (enemyHealth <= 0) {
            resetEnemyHealth();
        }
  //  }, 1000);
}

// Reset enemy health for next round
//function resetEnemyHealth() {
  //  enemyHealth = 100; // Adjust as necessary for the game mechanics
//}

// Update the UI
//function updateUI() {
  //  document.getElementById("gold-display").innerText = `Gold: ${gold}`;
  //  document.getElementById("enemy-health").innerText = `Enemy Health: ${enemyHealth}`;
 //   checkForHeroes();
   // updateQuestProgress();
}

// Click to generate gold
//function generateGold() {
  //  gold += 1;
  //  updateUI();
}

// Initialize quests
function initializeQuests() {
 //   questData.forEach((quest, index) => {
   //     const questElement = document.createElement("div");
   //     questElement.id = `quest-${index}`;
  //      questElement.innerText = quest.description;
  //      document.getElementById("quests").appendChild(questElement);
    });
}

// Initialize skills
//function initializeSkills() {
 //   skillData.forEach((skill) => {
    //    const skillButton = document.createElement("button");
   //     skillButton.innerText = skill.name;
   //     skillButton.onclick = () => {
     //       if (gold >= skill.cost) {
      //          gold -= skill.cost;
     //           skill.effect();
        //        updateUI();
            }
        };
      //  document.getElementById("skills").appendChild(skillButton);
    });
}

// Initialize game
//function initializeGame() {
    initializeQuests();
    initializeSkills();
    updateUI();
}

//window.onload = initializeGame;


// Added credit to CrypticTM // 
// will keep here for reference if backup needed)
