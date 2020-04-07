const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);
const loader = new PIXI.Loader(); // you can also create your own if you want

loader.add('player', 'img/player.jpg');

var keys = [];
var player = {
	pV: 0,
	speed: 0.2,
	speedDamp: 0.98,
	rotateSpeed: 0.001,
	rotateDamp: 0.95,
	rV:0,
	init: function(sprite) {
		this.sprite = PIXI.Sprite.from(sprite);
		app.stage.addChild(this.sprite);

		this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);

		this.sprite.x = 20;
		this.sprite.y = 20;
	},
	update: function() {
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
