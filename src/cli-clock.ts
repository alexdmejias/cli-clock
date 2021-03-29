#!/usr/bin/env node

import { Command } from 'commander';
import Clock from './index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageFile = require('../package.json');

const program = new Command();
const list = (val) => val.split(',');

program
  .version(packageFile.version)
  .option('-b, --background [character]', 'background character')
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
clock.update();
