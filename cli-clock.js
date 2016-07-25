require('source-map-support/register');

const Clock = require('./dist');
const clock = new Clock();

function update() {
	clock.update();
	clock.draw();
}

setInterval(() => {
	update();
}, 30000);

process.stdout.on('resize', () => {
	update();
});

update();