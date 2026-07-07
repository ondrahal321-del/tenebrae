//////////////////////// GAME CLASS ////////////////////////
class Game {
  constructor(player, rooms, startingRoomIndex = 0) {
    this._player = player;
    this._rooms = rooms;
    this._currentRoom = this._rooms[startingRoomIndex];
  }

moveToRoom(direction) {

    const newRoom =
        this._currentRoom[`_room${direction.charAt(0).toUpperCase() + direction.slice(1)}`];
    if (newRoom) {
        this.clearResponse();
        this._currentRoom = newRoom;
        newRoom.enter();
    } else {
        this.setResponse(`You can't go ${direction}.`);
    }
}

setResponse(response) {
    const gameResponseText = document.getElementById("gameresponse");
    gameResponseText.innerHTML = response;
	gameResponseText.style.color = "red"
}

clearResponse(response) {
    const gameResponseText = document.getElementById("gameresponse");
    gameResponseText.innerHTML = response;
	gameResponseText.style.color = "#171717";
}

  // Get current room
  get currentRoom() {
    return this._currentRoom;
  }
}

//////////////////////// ROOM CLASS ////////////////////////
class Room {
  constructor(name, description) {
    this._name = name;
    this._description = description;
    this._items = [];
    this._enemies = [];
    this._options = []
  }

  enter() {

  }
  // Link rooms together
  linkRoom(roomNorth, roomEast, roomSouth, roomWest) {
    this._roomNorth = roomNorth;
    this._roomEast = roomEast;
    this._roomSouth = roomSouth;
    this._roomWest = roomWest;
  }

  // Add item to room
  addItem(item) {
    this._items.push(item)
  }

  // Add enemy to room
  addEnemy(enemy) {
    this._enemies.push(enemy);
  }

  // Add player options
  addPlayerOptions(options) {
    this._options = options;
  }

  // Remove player option (when used)
  removePlayerOptions(option) {
    this._options.forEach(item => {
      if (item.text === option) {
        item.text = `<s>${item.text}</s>`;
      }
    });
  }

  // Return options in the room
  returnOptions() {
    return this._options;
  }

  // Return parameters of the room
  returnName() {
    return this._name
  }

  // Return description of the room
  returnDescription() {
    return this._description
  }

  // Return items in the room
  returnItems() {
    if (this._items.length > 0) {
      return this._items.map(item => item.name);
    } else {
      return 'no items in this room';
    }
  }

  // Return enemy in the room
  returnEnemy() {
    if (this._enemies.length > 0) {
      return {
        name: this._enemies[0].name,
        description: this._enemies[0].description
      };
    } else {
      return {
        name: 'no enemy',
        description: 'no enemy in this room'
      };
    }
  }

	removeEnemy(enemy) {
    this._enemies = this._enemies.filter(e => e !== enemy);
}

}

//////////////////////// CHARACTER CLASS ////////////////////////
class Character {
      constructor(name, health, damage, armor, inventory) {
        this._name = name;
        this._health = health;
		this._damage = damage;
        this._armor = armor;
        this._inventory = inventory;
    }

    getWeaponDamage() {
        let highest = 5; // fists
        this._inventory.forEach(item => {
            if (item.damage > highest)
                highest = item.damage;
        });
        return highest;
    }

		getDamage() {
    let damage = this._damage;
    this._inventory.forEach(item => {
        if (item.damage)
            damage += item.damage;
    });
    return damage;
}

getArmor() {
    let armor = this._armor;
    this._inventory.forEach(item => {
        if (item.armor)
            armor += item.armor;
    });
    return armor;
}

  addItem(game, item) {
    this._inventory.push(item);
    game.setResponse(`You picked up ${item.name}.`)
  }

async fight(game, enemy) {
    let battleLog = "";
    while (this._health > 0 && enemy._health > 0) {
        const playerDamage =
            Math.max(1, this.getDamage() - enemy._armor);
        enemy._health -= playerDamage;
        battleLog += `You hit ${enemy._name} for ${playerDamage}.<br>`;
        game.setResponse(battleLog);
        updateUI();
        await new Promise(resolve => setTimeout(resolve, 600));
        if (enemy._health <= 0) break;
        const enemyDamage =
            Math.max(1, enemy._damage - this.getArmor());
        this._health -= enemyDamage;
        battleLog += `${enemy._name} hits you for ${enemyDamage}.<br>`;
        game.setResponse(battleLog);
        updateUI();
        await new Promise(resolve => setTimeout(resolve, 600));
		if (enemy._health <= 0) break;
    }
	console.log(this.getDamage());
	console.log(this.getArmor());
	console.log(enemy._damage);
	console.log(enemy._armor);
	console.log(playerDamage);
	console.log(enemyDamage);
    if (enemy._health <= 0) {
        battleLog += "<br>You won!";
        game._currentRoom.removeEnemy(enemy);

    } 
	if (this._health <= 0) {
        battleLog += "<br>You died!";
        this.loseGame();

    }
    game.setResponse(battleLog);
}

  winGame() {
    const displayText = document.getElementById("displaytext");
    const optionTitle = document.getElementById("options");
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    const option3 = document.getElementById("option3");
    const option4 = document.getElementById("option4");
    const health = document.getElementById("health");
	const input = document.getElementById("userInput");
    // Clear the options
    optionTitle.innerHTML = "";
    option1.innerHTML = "";
    option2.innerHTML = "";
    option3.innerHTML = "";
    option4.innerHTML = "";
    health.innerHTML = "";
	input.style.visibility="hidden";

    // Display the win message
    displayText.innerHTML = `<h3>You win</h3>You defeated main threat in the city and folllowers of Pure Worship has been scattered. But remember: There are many threats still hidden...  <button id="buttonMenu" onclick="location.href='index.html'">Return to Menu</button>`;
  }

takeDamage(amount, armor) {
    let damageTaken =
    enemy.getDamage() - this.getArmor();

if (damageTaken < 1)
    damageTaken = 1;

this._health -= damageTaken;

    if (this._health <= 0) {
        this._health = 0;
        this.loseGame();
    }
}

loseGame() {
    const displayText = document.getElementById("displaytext");
    const optionTitle = document.getElementById("options");
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    const option3 = document.getElementById("option3");
    const option4 = document.getElementById("option4");
    const health = document.getElementById("health");
	const input = document.getElementById("userInput");
    // Clear the options
    optionTitle.innerHTML = "";
    option1.innerHTML = "";
    option2.innerHTML = "";
    option3.innerHTML = "";
    option4.innerHTML = "";
    health.innerHTML = "";
	input.style.visibility="hidden";

    // Display the win message
    displayText.innerHTML = `<h3>You died</h3><button id="buttonMenu" onclick="location.href='index.html'">Return to Menu</button>`;
}

heal(game, amount) {
    const oldHealth = this._health;
    this._health = Math.min(100, this._health + amount);

    game.setResponse(
        `Recovered ${this._health - oldHealth} HP.`
    );
}


}

//////////////////////// ENEMY CLASS ////////////////////////
class Enemy {
  constructor(name, description, dialogue, damage, health, armor) {
    this._name = name;
    this._description = description;
    this._dialogue = dialogue;
    this._damage = damage;
	this._health = health;
	this.armor = armor;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get dialogue() {
    return this._dialogue;
  }

 get damage() {
        return this.getDamage();
    }

    takeDamage(enemy) {
    let damage = Math.max(1, enemy.damage - this.getArmor());
    this._health -= damage;
}
}
//////////////////////// ITEM CLASS ////////////////////////
class Item {
  constructor(name, damage, armor) {
    this.name = name;
	this.damage = damage;
	this.armor = armor;
  }
}



//////////////////////// ENEMIES ////////////////////////
const follower = new Enemy('a cult follower', 'a follower of Pure Worship shambling around the room', '', 20, 40, 5);
const drone = new Enemy('an drone', 'an drone whizzing around the room, sent by unknown person or faction', '', 50, 60, 10);
const shaman = new Enemy('an shaman', 'an shaman of Pure Worship mixing potions, unaware of your presence', '', 40, 60, 9);
const scavenger = new Enemy('a scavenger', 'a scavenger feasting on a corpse in the corner', '', 20, 40, 5);
const gangMember = new Enemy('a gang member', 'a gang member armed with a knife and tattoed symbol of Syndicete', '', 30, 50, 8);
const reverentFather = new Enemy('Reverent Father', 'Reverent Father sitting on the throne, scratching at the floor with a staff seemingly fused to his hand', '', 70, 200, 10);


//////////////////////// ITEMS ////////////////////////
const crowbar = new Item("a rusty crowbar", 20, 0);
const flashlight = new Item("a working flashlight", 2, 0);
const firstAidKit = new Item("a first aid kit", 0);
const rifle = new Item("a rifle AK-47", 50, 0);
const gasMask = new Item("a gas mask", 0, 20);
const gun = new Item("an old gun", 30, 0);

//////////////////////// ROOMS ////////////////////////

// Zábřeh
const zabrheh = new Room(
    "Zábřeh",
    "Burned cars and cracked roads stretch into the ruined city."
);

zabrheh.addItem(crowbar);
zabrheh.addEnemy(scavenger);
zabrheh.addPlayerOptions([
    {
        input:1,
        text:"Take the crowbar",
        action:(game)=>{
            game._player.addItem(game,crowbar);
            game._currentRoom.removePlayerOptions("Take the crowbar");
        }
    },
    {input:2,text:"Travel north to Vítkovice",action:(game)=>game.moveToRoom("north")},
    {
        input:3,
        text:"Fight the scavenger",
        action:(game)=>{
            game._player.fight(game,game._currentRoom._enemies[0]);
        }
    },
    {
        input:4,
        text:"Check inventory",
        action:(game)=>{
			let inventoryText = "Inventory:<br>";
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
                 player._inventory.forEach(item => {

        inventoryText += `${item.name}`;

        if (item.damage > 0)
            inventoryText += ` (Damage: ${item.damage})`;

        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// Vítkovice
const vitkovice = new Room(
    "Vítkovice",
    "Rusting factories and silent blast furnaces tower above you. Ash falls like snow."
);

vitkovice.addEnemy(drone);
vitkovice.addPlayerOptions([
    {input:1,text:"Fight the drone",action:(game)=>{
        game._player.fight(game,game._currentRoom._enemies[0]);
    }},
    {input:2,text:"Travel east to Nová Karolina",action:(game)=>game.moveToRoom("east")},
    {input:3,text:"Travel west to Přívoz",action:(game)=>game.moveToRoom("west")},
    {input:4,text:"Return south to Zábřeh",action:(game)=>game.moveToRoom("south")},
        {
        input:5,
        text:"Check inventory",
        action:(game)=>{
			let inventoryText = "Inventory:<br>";
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
                 player._inventory.forEach(item => {
        inventoryText += `${item.name}`;
        if (item.damage > 0) inventoryText += ` (Damage: ${item.damage})`;
        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// Přívoz
const privoz = new Room(
    "Přívoz",
    "Flooded streets and abandoned houses disappear into dark water."
);

privoz.addItem(flashlight);
privoz.addEnemy(gangMember);
privoz.addPlayerOptions([
    {
        input:1,
        text:"Take the flashlight",
        action:(game)=>{
            game._player.addItem(game,flashlight);
            game._currentRoom.removePlayerOptions("Take the flashlight");
        }
    },
    {
        input:2,
        text:"Fight the gang member",
        action:(game)=>{
            game._player.fight(game,game._currentRoom._enemies[0]);
        }
    },
    {input:3,text:"Travel north to Svinov",action:(game)=>game.moveToRoom("north")},
    {input:4,text:"Travel east to Vítkovice",action:(game)=>game.moveToRoom("east")},
        {
        input:5,
        text:"Check inventory",
        action:(game)=>{
			let inventoryText = "Inventory:<br>";
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
                 player._inventory.forEach(item => {
        inventoryText += `${item.name}`;
        if (item.damage > 0) inventoryText += ` (Damage: ${item.damage})`;
        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// Nová Karolina
const karolina = new Room(
    "Nová Karolina",
    "The shopping mall is silent. Escalators no longer move and shattered shop windows line the corridors."
);

karolina.addItem(firstAidKit);
karolina.addEnemy(follower);
karolina.addPlayerOptions([
    {
        input:1,
        text:"Take the first aid kit",
        action:(game)=>{
            game._player.heal(game, 50);
            game._currentRoom.removePlayerOptions("Take the first aid kit");
}},
    {
        input:2,
        text:"Fight the cult follower",
        action:(game)=>{
            game._player.fight(game,game._currentRoom._enemies[0]);
        }
    },
    {input:3,text:"Travel north to Dolní Vítkovice",action:(game)=>game.moveToRoom("north")},
    {input:4,text:"Travel west to Vítkovice",action:(game)=>game.moveToRoom("west")},
    {
        input:5,
        text:"Check inventory",
        action:(game)=>{
			let inventoryText = "Inventory:<br>";
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
                 player._inventory.forEach(item => {
        inventoryText += `${item.name}`;
        if (item.damage > 0) inventoryText += ` (Damage: ${item.damage})`;
        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// Svinov
const svinov = new Room(
    "Svinov Station",
    "Silent trains remain where the evacuation ended years ago."
);

svinov.addItem(rifle);

svinov.addPlayerOptions([
    {
        input:1,
        text:"Take the rifle",
        action:(game)=>{
            game._player.addItem(game,rifle);
            game._currentRoom.removePlayerOptions("Take the rifle");
        }
    },
    {input:2,text:"Travel east to Dolní Vítkovice",action:(game)=>game.moveToRoom("east")},
    {input:3,text:"Travel south to Přívoz",action:(game)=>game.moveToRoom("south")},
    {
        input:4,
        text:"Check inventory",
        action:(game)=>{
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
				let inventoryText = "Inventory:<br>";
                 player._inventory.forEach(item => {
        inventoryText += `${item.name}`;
        if (item.damage > 0) inventoryText += ` (Damage: ${item.damage})`;
        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// Dolní Vítkovice
const dolni = new Room(
    "Dolní Vítkovice",
    "Gigantic furnaces still glow beneath the rust as if someone keeps them alive."
);

dolni.addItem(gasMask);

dolni.addPlayerOptions([
    {
        input:1,
        text:"Take the gas mask",
        action:(game)=>{
            game._player.addItem(game,gasMask);
            game._currentRoom.removePlayerOptions("Take the gas mask");
        }
    },
    {input:2,text:"Travel north to Stodolní",action:(game)=>game.moveToRoom("north")},
    {input:3,text:"Travel east to City Hall",action:(game)=>game.moveToRoom("east")},
    {input:4,text:"Travel west to Svinov",action:(game)=>game.moveToRoom("west")},
    {
        input:5,
        text:"Check inventory",
        action:(game)=>{
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
				let inventoryText = "Inventory:<br>";
                 player._inventory.forEach(item => {
        inventoryText += `${item.name}`;
        if (item.damage > 0) inventoryText += ` (Damage: ${item.damage})`;
        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// Stodolní
const stodolni = new Room(
    "Stodolní Street",
    "Bars have become ruins illuminated only by flickering neon."
);

stodolni.addItem(gun);
stodolni.addEnemy(shaman);
stodolni.addPlayerOptions([
    {
        input:1,
        text:"Take the gun",
        action:(game)=>{
            game._player.addItem(game,gun);
            game._currentRoom.removePlayerOptions("Take the gun");
        }
    },
    {
        input:2,
        text:"Fight the shaman",
        action:(game)=>{
            game._player.fight(game,game._currentRoom._enemies[0]);
        }
    },
    {input:3,text:"Travel south to Dolní Vítkovice",action:(game)=>game.moveToRoom("south")},
    {
        input:4,
        text:"Check inventory",
        action:(game)=>{
			let inventoryText = "Inventory:<br>";
            if (player._inventory.length === 0) {
                game.setResponse("Your inventory is empty.");
            } 
            else {
                 player._inventory.forEach(item => {
        inventoryText += `${item.name}`;
        if (item.damage > 0) inventoryText += ` (Damage: ${item.damage})`;
        inventoryText += "<br>";
		game.setResponse(inventoryText);
    });
        }
    }  
} 
]);

// City Hall
const cityHall = new Room(
    "New City Hall",
    "The emergency command bunker lies beneath the tower. In the hall is skeleton tied up to the electric chair, with name tag starting on 'A'. But the air here fells ominious and heavy. The city's main threat waits here."
);
cityHall.addEnemy(reverentFather);
cityHall.addPlayerOptions([
{
        input:1,
        text:"Fight Reverent Father",
        action:(game)=>{
            game._player.fight(game,game._currentRoom._enemies[0]);
	    setTimeout(()=>{
                game._player.winGame();
            },10000);
        }
    }
]);

///// Link rooms together
// .linkRoom(roomNorth, roomEast, roomSouth, roomWest)
zabrheh.linkRoom(vitkovice,null,null,null);
vitkovice.linkRoom(null,karolina,zabrheh,privoz);
privoz.linkRoom(svinov,vitkovice,null,null);
karolina.linkRoom(dolni,null,null,vitkovice);
svinov.linkRoom(null,dolni,privoz,null);
dolni.linkRoom(stodolni,cityHall,null,svinov);
stodolni.linkRoom(null,null,dolni,null);
cityHall.linkRoom(null,null,null,dolni);
const allRooms = [
    zabrheh,
    vitkovice,
    privoz,
    karolina,
    svinov,
    dolni,
    stodolni,
    cityHall
];


const displayText = document.getElementById("displaytext");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");

let player = new Character('Player', 100, 40, 5, []);
let game = new Game(player, allRooms);


// Displays the current room and text to the user
function updateUI() {
  function displayRoom() {
    let roomName = game.currentRoom.returnName();
    let roomDescription = game.currentRoom.returnDescription();
    let roomItems = game.currentRoom.returnItems();
let roomEnemy = game.currentRoom.returnEnemy();

let enemyText = "";

if (roomEnemy) {
    enemyText = `There is ${roomEnemy.description}.`;
} else {
    enemyText = "The area seems quiet.";
}

displayText.innerHTML =
`You are in ${roomName}. ${roomDescription}
 You see ${roomItems}.
 ${enemyText}`;
    document.getElementById("health").textContent = `Health: ${player._health}/100`;
	document.getElementById("damage").textContent = `Damage: ${player.getDamage()}`;
	document.getElementById("armor").textContent = `Armor: ${player.getArmor()}`;
  }
  displayRoom();

  function displayOptions() {

    // Clear old options
    option1.innerHTML = "";
    option2.innerHTML = "";
    option3.innerHTML = "";
    option4.innerHTML = "";

    // Get the options from the current room
    let roomOptions = game.currentRoom.returnOptions();

    // Set new options
    if (roomOptions[0]) option1.innerHTML = "1. " + roomOptions[0].text;
    if (roomOptions[1]) option2.innerHTML = "2. " + roomOptions[1].text;
    if (roomOptions[2]) option3.innerHTML = "3. " + roomOptions[2].text;
    if (roomOptions[3]) option4.innerHTML = "4. " + roomOptions[3].text;

  }
  displayOptions();

}

updateUI();

// Handles the user input and runs the selected option (1, 2, 3, 4, 5)
function userInput() {
  let inputField = document.getElementById('userInput');

  inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      // Stops the page from reloading on enter
      event.preventDefault();

      // Get the user input and clear the input field
      let userInput = inputField.value;
      inputField.value = '';
      userInput = Number(userInput);

      // Get the options from the current room
      let roomOptions = game.currentRoom.returnOptions();

      // Find the selected option based on input value.
      let selectedOption = roomOptions.find(option => option.input === userInput);

      // Check if the selected option exists (if it is 1, 2, 3, 4)
      if (selectedOption && !selectedOption.text.includes("<s>")) {
        // Execute the selected option's action and pass the game object.
        selectedOption.action(game);

        // Update the UI after performing the action.
        updateUI();

      } else {
        console.error("Invalid input. Please enter a valid option number.");
      }
    }
  });
}

userInput();

