const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

var keys = [];
var player = {
	xV: 0,
	yV: 0,
	xA: 0,
	yA: 0,
	speed: 0.1,
	rotateSpeed: 0.01,
	rotateAngle: 0,
	rV:0,
	init: function() {
		app.stage.addChild(this.sprite);
	},
	update: function() {
		this.xA = 0;
		this.yA = 0;
		if (keys[87]) { // W
			this.yA = -this.speed;
		}
		if (keys[83]) { // S
			this.yA = this.speed;
		}
		if (keys[65]) { // A
			this.sprite.rotation -= this.rotateSpeed;
			// this.xA = -this.speed;
		}
		if (keys[68]) { // D
			this.sprite.rotation += this.rotateSpeed;
			// this.xA = this.speed;
		}

		this.xV += this.xA;
		this.yV += this.yA;

		this.sprite.x += this.xV;
		this.sprite.y += this.yV;
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
