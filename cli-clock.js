#!/usr/bin/env node

require('source-map-support/register');
const program = require('commander');
const argv = require('minimist')(process.argv.slice(2));
const Clock = require('./dist');

function list(val) {
  return val.split(',');
}

program
  .version('0.4.0')
  .option('-b, --background [character]', 'baground character', list)
  .option('-f, --foreground [character]', 'foreground characters color', list)
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