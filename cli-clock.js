#!/usr/bin/env node

require('source-map-support/register');
const program = require('commander');
const package = require('./package.json');
const Clock = require('./dist');

const list = (val) => val.split(',');

program
  .version(package.version)
  .option('-b, --background [character]', 'baground character')
  .option('-f, --foreground [character]', 'foreground characters color')
  .option('-c, --colors [item(s)]', 'characters colors for the foreground and background, respectively', list)
  .option('-t, --twelve-hours', 'twelve hour format')
  .option('-x, --coin [character]', 'coinbase compatible currency pair, eg: LTC-USD or ETH-USD')
  .option('-i, --interval <n>', 'refresh rate, in milliseconds, defaults to 30 seconds')
  .parse(process.argv);

const clock = new Clock(program);

setInterval(() => {
  clock.update();
}, program.interval || 30 * 1000);

process.stdout.on('resize', () => {
  clock.update();
});

clock.update();
