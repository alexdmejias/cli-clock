#!/usr/bin/env node

/**
 * CLI-CLOCK 
 * 
 * Cli-Clock is a clock for your terminal. Once you run the program, it will display the current time on your 
 * terminal windo and ti will update every thirty seconds. The clock is formed by two characters, which are choosen 
 * from a preselected set of characters or passed as arguments by the user. Once the program starts, the application will 
 * measure the size of the current terminal window and display the time in the center of the window.
 * 
 * Example usage:
 * 
 * $ node cli-clock.js 
 * $ node cli-clock.js " " X
 * $ node cli-clock.js -b " " -f X
 * $ node cli-clock.js -b O -f 🐶 
 * $ node cli-clock.js 😁 😡
 * 
 * 
 */

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