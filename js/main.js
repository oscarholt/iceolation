const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

var keys = [];
var player = {
	pV: 0,
	speed: 0.1,
	speedDamp: 0.95,
	rotateSpeed: 0.005,
	rotateDamp: 0.95,
	rV:0,
	init: function() {
		app.stage.addChild(this.sprite);
		this.sprite.pivot.set(0.5, 0.5);
	},
	update: function() {
		if (keys[87]) { // W
			this.pV += this.speed;
		}
		if (keys[83]) { // S
			this.pV -= this.speed;
		}
		if (keys[65]) { // A
			this.rV -= this.rotateSpeed;
			// this.xA = -this.speed;
		}
		if (keys[68]) { // D
			this.rV += this.rotateSpeed;
			// this.xA = this.speed;
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
	},
	sprite: PIXI.Sprite.from('img/player.jpg')
}

function init() {
	player.init();

	app.ticker.add((delta) => { // Draw
		draw();
	});

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

init();
