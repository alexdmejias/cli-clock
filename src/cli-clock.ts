#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

const packageFile = require('../package.json');
const Clock = require('./index');

const list = (val) => val.split(',');

program
  .version(packageFile.version)
  .option('-b, --background [character]', 'baground character')
  .option('-f, --foreground [character]', 'foreground characters color')
  .option('-c, --colors [item(s)]', 'characters colors for the foreground and background, respectively', list)
  .option('-F, --font <type>', 'TODO')
  .option('-t, --twelve-hours', 'twelve hour format')
  .option('-x, --coin [character]', 'coinbase compatible currency pair, eg: LTC-USD or ETH-USD')
  .option('-i, --interval <n>', 'refresh rate, in milliseconds, defaults to 30 seconds')
  .parse(process.argv);

const options = program.opts();
const clock = new Clock(options);

setInterval(() => {
  clock.update();
}, options.interval || 30 * 1000);

process.stdout.on('resize', () => {
  clock.update();
});
console.log('options')
console.log(options)
clock.update();