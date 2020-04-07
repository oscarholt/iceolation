const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

var player = {
	x: 0,
	y: 0,
	xV: 0,
	yV: 0,
	xA: 0,
	yA: 0,
	init: function() {
		app.stage.addChild(this.sprite);
	},
	update: function() {
		this.xV += this.xA;
		this.yV += this.yA;

		this.x += this.xV;
		this.y += this.yV;
	},
	sprite: PIXI.Sprite.from('img/player.jpg')
}

function init() {
	player.init();
}

app.ticker.add((delta) => { // Draw
	player.update();
});

init();
