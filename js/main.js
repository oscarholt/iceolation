const app = new PIXI.Application({ backgroundColor: 0xAADBFF });
document.body.appendChild(app.view);
const loader = new PIXI.Loader(); // you can also create your own if you want

loader.add('player', 'img/player.png');
loader.add('player_2', 'img/player_2.png');

var keys = [];
var player = {
	textures: [],
	currentTexture: 0,
	textureCounter: 0,
	pV: 0,
	speed: 0.2,
	speedDamp: 0.98,
	rotateSpeed: 0.001,
	rotateDamp: 0.95,
	rV:0,
	init: function(sprite) {
		this.textures = [loader.resources.player.texture, loader.resources.player_2.texture];
		this.sprite = PIXI.Sprite.from(this.textures[this.currentTexture]);
		app.stage.addChild(this.sprite);

		this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);

		this.sprite.x = window.innerWidth/2; //Center horizontally
		this.sprite.y = window.innerHeight/2; //Center vertically
	},
	update: function() {

		if((this.sprite.x + this.sprite.width/2) > window.innerWidth || (this.sprite.x - this.sprite.width/2) < 0){
			pV *= -0.2;
		}

		if(this.sprite.y > window.innerHeight || this.sprite.y < 0){
			pV *= -0.2;
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

		if (!keys[87] && !keys[83]) { // Neither A or D pressed
			this.pV *= this.speedDamp;
		}
		if (!keys[65] && !keys[68]) { // Neither A or D pressed
			this.rV *= this.rotateDamp;
		}

		this.sprite.x += Math.cos(this.sprite.rotation) * this.pV;
		this.sprite.y += Math.sin(this.sprite.rotation) * this.pV;

		this.sprite.rotation += this.rV;

		// Swap texture every 10 frames
		if (Math.abs(this.pV) > 2) {
			this.textureCounter++;
			if (this.textureCounter > 10) {
				this.currentTexture = (this.currentTexture == 0) ? 1 : 0;
				this.sprite.texture = this.textures[this.currentTexture];

				this.textureCounter = 0;
			}
		}
	}
}

loader.load((loader, resources) => {
	player.init(resources.player.texture);

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
}
