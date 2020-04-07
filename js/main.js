function setup() {

}

function draw() {
	var i = 50;
	var j = 10;
	var count = 0;
	while(count < 10){
		ellipse(i, i, j, j);
		i += 10;
		j += 10;
		count++;
	}
}
