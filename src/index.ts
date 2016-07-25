const utils = require('./utilities');
const colors = require('cli-color');
const clear = require('cli-clear');

import fonts from './fonts';

class Clock {
  public rows: number;
  public columns: number;

  public availableSets: Array<string[]> = [['•', 'X'], ['\\', '/'], ['-', '_'], ['0', '1'], [' ', '█']];
  public currentSet: string[];
  public font;

  public buffer: Array<number[]> = [];

  constructor(args) {
    this.setSize();
    this.setSet(args);
    this.setFont();

    // MODE TO UPDATE function
    for (let i = 0; i < this.rows; i++) {
      this.buffer[i] = [];
      for (let h = 0; h < this.columns; h++) {
        this.buffer[i][h] = 0;
      }
    }
  }

  public setFont(): void {
    this.font = fonts.fiveByEight;
  }

  public setSet(args): void {
    if (args.b && args.f) {
      this.currentSet = [args.b, args.f];
    } else if (args._.length === 2) {
      this.currentSet = args._;
    } else {
      this.currentSet = this.availableSets[utils.getRandom(this.availableSets)];
      // randomly reverse the array, so we can have a random BG and FG
      if (Math.round(Math.random())) {
        this.currentSet = this.currentSet.reverse();
      }
    }
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
    this.buffer.map((curr, i) => {
      this.buffer[i].fill(0);
    });
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
        const thisRow = this.font.characters[numToDisplay[h]][i].split('');

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
    const d = new Date();
    // get the time from the string that we get
    const timeArr: string[] = d.toTimeString().slice(0, 5).split('');

    // replace the colon with the colon index from the font array
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
