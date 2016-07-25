require('source-map-support/register');

const Clock = require('./dist');
const clock = new Clock();

clock.update();
clock.draw();

setInterval(() => {
	clock.update();
	clock.draw();
}, 30000);
