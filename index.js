const Clock = require('./bin/index');

const clock = new Clock();

clock.update();
clock.draw();

setInterval(() => {
	clock.update();
	clock.draw();
}, 30000);