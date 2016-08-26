#!/usr/bin/env node

require('source-map-support/register');
const program = require('commander');
const Clock = require('./dist');

const list = (val) => val.split(',');

program
  .version('0.4.0')
  .option('-b, --background [character]', 'baground character')
  .option('-f, --foreground [character]', 'foreground characters color')
  .option('-c, --colors [item(s)]', 'characters colors for the foreground and background, respectively', list)
  .option('-t, --twelve-hours', 'twelve hour format')
  .parse(process.argv);

const clock = new Clock(program);

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