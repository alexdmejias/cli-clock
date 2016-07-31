const utils = require('./utilities');
const colors = require('cli-color');
const clear = require('cli-clear');
const moment = require('moment');

import fonts from './fonts';

class Clock {
  public rows: number;
  public columns: number;

  public availableSets: Array<string[]> = [['•', 'X'], ['\\', '/'], ['-', '_'], ['0', '1'], [' ', '█']];
  public currentSet: string[];
  public font;

  public fc: string = 'black';
  public bc: string = 'black';

  public twelveHourFormat: boolean = true;

  public buffer: Array<number[]> = [];

  constructor(args) {
    this.setSize();
    this.setColors(args);
    this.setSet(args);
    this.setFont();
    this.setFormat(args);
  }

  public setColors(args): void {
    if (args.colors) {
      if (colors[args.colors[0]]) {
        this.fc = args.colors[0];
      }

      if (colors[args.colors[1]]) {
        this.bc = args.colors[1];
      }
    }
  }

  public setFont(): void {
    this.font = fonts.fiveByEight;
  }

  public setFormat(args): void {
    this.twelveHourFormat = args.twelveHours;
  }

  /**
   * Sets the set of characters to use for both the foreground 
   * and background
   */
  public setSet(args): void {
    this.currentSet = this.availableSets[utils.getRandom(this.availableSets)];
    // randomly reverse the array, so we can have a random BG and FG
    if (Math.round(Math.random())) {
      this.currentSet = this.currentSet.reverse();
    }

    if (args.background) {
      this.currentSet[0] = args.background;
    }

    if (args.foreground) {
      this.currentSet[1] = args.foreground;
    }

    this.currentSet[0] = colors[this.bc](this.currentSet[0]);
    this.currentSet[1] = colors[this.fc](this.currentSet[1]);
  }

  public setSize(): void {
    if (process.stdout.rows && process.stdout.rows) {
      this.rows = process.stdout.rows;
      this.columns = process.stdout.columns;
    } else {
      this.rows = 20;
      this.columns = 50;
    }
  }

  // returns the size of the first character in a set
  public getLetterDimensions(character): {height: number, padding: number, width: number} {
    return {
      height: character.length,
      padding: 1,
      width: character[0].split('').length
    }
  }

  public getTotalWidth(): number {
    return (this.font.width + (this.font.padding * 2)) * 5;
  }

  public getTotalHeight(): number {
    return (this.font.height + (this.font.padding * 2));
  }

  /**
   * Fill the background with zeros aka the background character
   */
  public setBg(): void {
    // cycle through all the columns putting a zero on every column
    // rows then columns
    this.buffer = [];
    for (let i = 0; i < this.rows; i++) {
      this.buffer[i] = [];
      for (let h = 0; h < this.columns; h++) {
        this.buffer[i][h] = 0;
      }
    }
  }

  /**
   * Replace the appropriate background characters with the foreground ones
   */
  public setFg(): void {
    const totalTextWidth = this.getTotalWidth();

    const terminalHorCenter = Math.floor(this.columns / 2);
    const terminalOffset = terminalHorCenter - Math.floor(totalTextWidth / 2);

    const terminalVerCenter = Math.floor(this.rows / 2);
    const terminalVerOffset = terminalVerCenter - (this.font.height / 2);

    const numToDisplay = this.getTime();

    // cycle through the time numbers
    for (let h = 0; h < numToDisplay.length; h++) {
      const leftIndex = (h * (this.font.width + (this.font.padding * 2))) + terminalOffset;

      // cycle through the height of the numbers
      for (let i = 0; i < this.font.height; i++) { 

        // the row from the number to cycle through
        const currentChar = this.font.characters[numToDisplay[h]]; 
        const thisRow = currentChar[i].split('');

        // replace the sections of the buffer with the section from the number
        this.buffer[terminalVerOffset + i].splice(leftIndex, thisRow.length, ...thisRow);
      }
    }
  }

  /**
   * Helper to Clear out the background
   */
  public clear(): void {
    clear();
  }

  /**
   * Get the numbers that will be displayed. Will come from the time object
   */
  public getTime(): string[] {
    let timeArr: string[];
    let timeFormat: string = 'HH:mm';

    if (this.twelveHourFormat) {
      timeFormat = 'hh:mm';
    }

    timeArr = moment().format(timeFormat).split('');
    timeArr[2] = 'separator';

    return timeArr;
  }

  /**
   * Update the buffer
   */
  public update(): void {
    this.setSize();
    this.setBg();
    this.setFg();
  }

  /**
   * draw out the buffer
   */
  public draw(): void {
    let toPaint = '';

    this.buffer.forEach((row) => {
      let currentRow = row.reduce((prev, curr) => {
        return prev + this.currentSet[curr];
      }, '');

      toPaint += '\n' + currentRow;
    });

    this.clear();
    process.stdout.write(toPaint);
  }
}

module.exports = Clock;
