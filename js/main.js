const app = new PIXI.Application({ backgroundColor: 0x45A1E4 });
document.body.appendChild(app.view);
const loader = new PIXI.Loader(); // you can also create your own if you want

loader.add('player', 'img/player.png');
loader.add('player_2', 'img/player_2.png');
loader.add('player_3', 'img/player_3.png');
loader.add('blood_1', 'img/blood_1.png');

var keys = [];
var win = {
	width: 0,
	height: 0
}
var camera = {
	x: 0,
	y: 0,
	speed: 5,
	init: function() {

	},
	update: function() {
		// Move camera smoothly
		this.x = player.sprite.x;
		this.y = player.sprite.y;

		app.stage.x = -camera.x + win.width / 2;
		app.stage.y = -camera.y + win.height / 2;
	}
}
var playpen = {
	width: 5000,
	height: 3000,
	sprite: new PIXI.Graphics(),
	init: function() {
		app.stage.addChild(this.sprite);
		app.stage.addChild(blood);
	},
	update: function() {
		this.sprite.clear();

		this.sprite.lineStyle(10, 0xFFFFFF, 1);
		this.sprite.beginFill(0xAADBFF);
		this.sprite.drawRect(0, 0, this.width, this.height);
		this.sprite.endFill();

		// Draw player trail
		if (player.trail[0] != undefined) { // If player has a trail
			this.sprite.moveTo(player.trail[0].x, player.trail[0].y);
			for (var i = 1; i < player.trail.length; i++) {
				var coords = player.trail[i];

				this.sprite.lineTo(Math.max(Math.min(coords.x, this.width), 0), Math.max(Math.min(coords.y, this.height), 0));
			}
			this.sprite.endFill();
		}

		// Draw enemy trails
		for (var e = 0; e < enemies.length; e++) {
			var enemy = enemies[e];

			if (enemy.trail[0] != undefined) { // If enemy has a trail
				this.sprite.moveTo(enemy.trail[0].x, enemy.trail[0].y);
				for (var i = 1; i < enemy.trail.length; i++) {
					var coords = enemy.trail[i];

					this.sprite.lineTo(coords.x, coords.y);
				}
				this.sprite.endFill();
			}
		}
	}
};
var blood = new PIXI.ParticleContainer();
var enemies = [];
var player = {
	textures: [],
	currentTexture: 0,
	textureCounter: 0,
	pV: 0,
	speed: 0.1,
	speedDamp: 0.995,
	rotateSpeed: 0.002,
	rotateDamp: 0.995,
	rV:0,
	trail: [],
	trailLength: 500,
	damageRange: 100,
	damageStrength: 40,
	health: 100,
	init: function(sprite) {
		this.textures = [loader.resources.player.texture, loader.resources.player_2.texture, loader.resources.player_3.texture];
		this.sprite = PIXI.Sprite.from(this.textures[this.currentTexture]);
		app.stage.addChild(this.sprite);

		// Add graphics layer
		this.graphics = new PIXI.Graphics();
		this.sprite.addChild(this.graphics); // Make graphics a child of sprite

		this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);

		this.sprite.x = 800; //Center horizontally
		this.sprite.y = 800; //Center vertically
	},
	update: function() {
		this.graphics.clear();

		// if((this.sprite.x + this.sprite.width/2) > playpen.width || (this.sprite.x - this.sprite.width/2) < 0){
		// 	this.sprite.rotation = Math.PI - this.sprite.rotation;
		// 	//this.pV *= 0.5;
		// 	this.rV *= 0.5;
		// }
		//
		// if((this.sprite.y + this.sprite.height/2) > playpen.height || (this.sprite.y - this.sprite.height/2) < 0){
		// 	this.sprite.rotation = 2 * Math.PI - this.sprite.rotation;
		// 	//this.pV *= 0.5;
		// 	this.rV *= 0.5;
		// }

		if (keys[87]) { // W
			this.pV += this.speed;
		}
		if (keys[83]) { // S
			this.pV -= this.speed;
		}
		if (keys[65]) { // A
			if (keys[83]) { // S // For when player is moving backwards
				this.rV += this.rotateSpeed;
			}
			else {
				this.rV -= this.rotateSpeed;
			}
		}
		if (keys[68]) { // D
			if (keys[83]) { // S
				this.rV -= this.rotateSpeed;
			}
			else {
				this.rV += this.rotateSpeed;
			}
		}
		if(!keys[65] && !keys[68]){
			this.rotateDamp = 0.95;
		}
		else {
			this.rotateDamp = 0.995;
		}


		var footX = this.sprite.x - Math.cos(this.sprite.rotation + Math.PI / 2) * -100;
		var footY = this.sprite.y - Math.sin(this.sprite.rotation + Math.PI / 2) * -100;

		this.pV *= this.speedDamp;
		this.rV *= this.rotateDamp;

		this.sprite.x += Math.cos(this.sprite.rotation) * this.pV;
		this.sprite.y += Math.sin(this.sprite.rotation) * this.pV;

		this.sprite.rotation += this.rV;

		this.sprite.x = Math.max(Math.min(this.sprite.x, playpen.width), 0);
		this.sprite.y = Math.max(Math.min(this.sprite.y, playpen.height), 0);

		// Swap texture every 10 frames
		if (keys[32]) { // Space bar
			this.textureCounter++;
			if (this.textureCounter > 10) {
				this.currentTexture = (this.currentTexture == 0) ? 1 : 0;
				this.sprite.texture = this.textures[this.currentTexture];

				// Punch
				damageNearby(this.sprite.x + Math.cos(this.sprite.rotation) * this.damageRange, this.sprite.y + Math.sin(this.sprite.rotation) * this.damageRange, this.damageRange, this.damageStrength); // Offset damage to be in front of player
				//damageInFront(this.sprite.x, this.sprite.y, this.sprite.rotation, 100, 10);

				this.textureCounter = 0;
			}
		}
		else if (this.pV < -1) {
			this.sprite.texture = this.textures[2];
		}
		else {
			this.sprite.texture = this.textures[0];
		}

		// Add position to trail array
		this.trail.push({
			x: footX,
			y: footY
		});
		if (this.trail.length > this.trailLength) {
			this.trail.shift(); // Remove first element
		}

		// Draw graphics
		this.graphics.lineStyle(10, 0xFF0000, 1);
		this.graphics.moveTo(0, -20);
		this.graphics.lineTo(this.sprite.width * (this.health / 100), -20);
	}
}

function Enemy() {
	this.textures = [],
	this.currentTexture = 0,
	this.textureCounter = 0,
	this.pV = 0,
	this.speed = 0.2,
	this.speedDamp = 0.995,
	this.rotateSpeed = 0.002,
	this.rotateDamp = 0.995,
	this.rV = 0,
	this.trail = [],
	this.trailLength = 500,
	this.health = 100,
	this.kill = function() {
		var index = enemies.indexOf(this);

		app.stage.removeChild(this.sprite);
		enemies.splice(index, 1); // Remove enemy from array
	}
	this.init = function() {
		this.textures = [loader.resources.player.texture, loader.resources.player_2.texture, loader.resources.player_3.texture];
		this.sprite = PIXI.Sprite.from(this.textures[this.currentTexture]);
		app.stage.addChild(this.sprite);

		// Add graphics layer
		this.graphics = new PIXI.Graphics();
		this.sprite.addChild(this.graphics); // Make graphics a child of sprite

		this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);

		this.sprite.x = Math.random() * playpen.width; // Place enemy randomly
		this.sprite.y = Math.random() * playpen.height;

		this.speed = Math.random() * 4 + 4;
	},
	this.update = function() {
		this.graphics.clear();

		// if((this.sprite.x + this.sprite.width/2) > playpen.width || (this.sprite.x - this.sprite.width/2) < 0){
		// 	this.sprite.rotation = Math.PI - this.sprite.rotation;
		// 	//this.pV *= 0.5;
		// 	this.rV *= 0.5;
		// }
		// if((this.sprite.y + this.sprite.height/2) > playpen.height || (this.sprite.y - this.sprite.height/2) < 0){
		// 	this.sprite.rotation = 2 * Math.PI - this.sprite.rotation;
		// 	//this.pV *= 0.5;
		// 	this.rV *= 0.5;
		// }

		var footX = this.sprite.x - Math.cos(this.sprite.rotation + Math.PI / 2) * -100;
		var footY = this.sprite.y - Math.sin(this.sprite.rotation + Math.PI / 2) * -100;

		// AI
		this.sprite.rotation = -Math.atan2(player.sprite.x - this.sprite.x,  player.sprite.y - this.sprite.y) + (Math.PI / 2); // Point towards player
		if (Math.sqrt(Math.pow(player.sprite.x - this.sprite.x, 2) + Math.pow(player.sprite.y - this.sprite.y, 2)) > 100) { // Get distance to player
			this.pV = this.speed;
		}
		else {
			this.pV = 0;
		}

		//this.pV *= this.speedDamp;
		//this.rV *= this.rotateDamp;

		this.sprite.x += Math.cos(this.sprite.rotation) * this.pV;
		this.sprite.y += Math.sin(this.sprite.rotation) * this.pV;

		//this.sprite.rotation += this.rV;

		// Swap texture every 10 frames
		if (this.pV > 2) {
			this.textureCounter++;
			if (this.textureCounter > 10) {
				this.currentTexture = (this.currentTexture == 0) ? 1 : 0;
				this.sprite.texture = this.textures[this.currentTexture];

				this.textureCounter = 0;
			}
		}
		else if (this.pV < -1) {
			this.sprite.texture = this.textures[2];
		}
		else {
			this.sprite.texture = this.textures[0];
		}

		// Add position to trail array
		this.trail.push({
			x: footX,
			y: footY
		});
		if (this.trail.length > this.trailLength) {
			this.trail.shift(); // Remove first element
		}

		// Draw graphics
		this.graphics.lineStyle(10, 0xFF0000, 1);
		this.graphics.moveTo(0, -20);
		this.graphics.lineTo(this.sprite.width * (this.health / 100), -20);

		// Calc health
		if (this.health < 1) {
			addBloodSplat(this.sprite.x + (Math.random() - 0.5) * 100, this.sprite.y + (Math.random() - 0.5) * 100)
			this.kill();
		}
	}
}
function addEnemy() {
	var enemy = new Enemy();

	enemy.init();
	enemies.push(enemy);
}
function addBloodSplat(x, y) {
	var bloodSprite = PIXI.Sprite.from(loader.resources.blood_1.texture);
  blood.addChild(bloodSprite);

	bloodSprite.x = x;
	bloodSprite.y = y;
	bloodSprite.pivot.set(bloodSprite.width/2, bloodSprite.height/2);
}

function damageNearby(x, y, range, damage) {
	for (var e = 0; e < enemies.length; e++) { // See if ray is inside enemy
		var enemy = enemies[e];
		var dist = Math.sqrt(Math.pow(x - enemy.sprite.x, 2) + Math.pow(y - enemy.sprite.y, 2));

		if (dist < range) { // Ray is inside enemy
			enemy.health -= damage;

			break;
		}
	}
}
function damageInFront(x, y, angle, range, damage) {
	for (var e = 0; e < enemies.length; e++) { // See if ray is inside enemy
		var enemy = enemies[e];

		for (var i = 0; i < range; i++) { // Send ray
			var ray = {
				x: x,
				y: y,
				angle: angle
			};
			var dist = Math.sqrt(Math.pow(enemy.sprite.x - ray.x, 2) + Math.pow(enemy.sprite.y - ray.y, 2));

			if (dist < enemy.sprite.width) { // Ray is inside enemy
				enemy.health -= damage;

				break;
			}

			ray.x += Math.cos(ray.angle);
			ray.y += Math.sin(ray.angle);
		}
	}
}

loader.load((loader, resources) => {
	playpen.init();
	player.init(resources.player.texture);

	init();
});

function init() {
	win.width = window.innerWidth;
	win.height = window.innerHeight;

	app.ticker.add((delta) => { // Draw
		draw();
	});

	// Fill screen
	app.renderer.view.style.position = "absolute";
	app.renderer.view.style.display = "block";
	app.renderer.autoResize = true;
	app.renderer.resize(win.width, win.height);

	window.addEventListener("keydown", function(event) {
		keys[event.keyCode] = true;
	});
	window.addEventListener("keyup", function(event) {
		keys[event.keyCode] = false;
	});

	addEnemy();
	addEnemy();
	addEnemy();
	addEnemy();
	addEnemy();
	addEnemy();
}

function draw() {
	camera.update();
	playpen.update();
	player.update();

	for (var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];

		enemy.update();
	}
}
