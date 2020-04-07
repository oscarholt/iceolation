const app = new PIXI.Application({ backgroundColor: 0xAADBFF });
document.body.appendChild(app.view);
const loader = new PIXI.Loader(); // you can also create your own if you want

loader.add('player', 'img/player.png');
loader.add('player_2', 'img/player_2.png');
loader.add('player_3', 'img/player_3.png');

var keys = [];
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

		app.stage.x = -camera.x + window.innerWidth / 2;
		app.stage.y = -camera.y + window.innerHeight / 2;
	}
}
var playpen = {
	width: 5000,
	height: 3000,
	sprite: new PIXI.Graphics(),
	init: function() {
		app.stage.addChild(this.sprite);
	},
	update: function() {
		this.sprite.lineStyle(10, 0xFFFFFF, 1);
		this.sprite.drawRect(0, 0, this.width, this.height);
	}
};
var player = {
	textures: [],
	currentTexture: 0,
	textureCounter: 0,
	pV: 0,
	speed: 0.2,
	speedDamp: 0.995,
	rotateSpeed: 0.001,
	rotateDamp: 0.999,
	rV:0,
	init: function(sprite) {
		this.textures = [loader.resources.player.texture, loader.resources.player_2.texture, loader.resources.player_3.texture];
		this.sprite = PIXI.Sprite.from(this.textures[this.currentTexture]);
		app.stage.addChild(this.sprite);

		this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);

		this.sprite.x = 200; //Center horizontally
		this.sprite.y = 200; //Center vertically
	},
	update: function() {

		if((this.sprite.x + this.sprite.width/2) > playpen.width || (this.sprite.x - this.sprite.width/2) < 0){
			this.sprite.rotation = Math.PI - this.sprite.rotation;
			//this.pV *= 0.5;
			this.rV *= 0.5;
		}

		if((this.sprite.y + this.sprite.height/2) > playpen.height || (this.sprite.y - this.sprite.height/2) < 0){
			this.sprite.rotation = 2 * Math.PI - this.sprite.rotation;
			//this.pV *= 0.5;
			this.rV *= 0.5;
		}

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

		this.pV *= this.speedDamp;
		this.rV *= this.rotateDamp;

		this.sprite.x += Math.cos(this.sprite.rotation) * this.pV;
		this.sprite.y += Math.sin(this.sprite.rotation) * this.pV;

		this.sprite.rotation += this.rV;

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
	}
}

loader.load((loader, resources) => {
	player.init(resources.player.texture);
	playpen.init();

	init();
});

function init() {
	app.ticker.add((delta) => { // Draw
		draw();
	});

	// Fill screen
	app.renderer.view.style.position = "absolute";
	app.renderer.view.style.display = "block";
	app.renderer.autoResize = true;
	app.renderer.resize(window.innerWidth, window.innerHeight);

	window.addEventListener("keydown", function(event) {
		keys[event.keyCode] = true;
	});
	window.addEventListener("keyup", function(event) {
		keys[event.keyCode] = false;
	});
}

function draw() {
	player.update();
	playpen.update();
	camera.update();
}
