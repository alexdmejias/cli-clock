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
    if (args.bc && colors[args.bc]) {
      this.bc = args.bc;
    }

    if (args.fc && colors[args.fc]) {
      this.fc = args.fc;
    }
  }

  public setFont(): void {
    this.font = fonts.fiveByEight;
  }

  public setFormat(args): void {
    this.twelveHourFormat = args.twelve;
  }

  /**
   * Sets the set of characters to use for both the foreground 
   * and background
   */
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
    // TODO: CLEAN.THIS.UP
    const d = new Date();
    const timeArr: string[] = [];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const hoursString: string[] = hours.toString().split('');
    const minutesString: string[] = minutes.toString().split('');
    
    if (!this.twelveHourFormat) {
      timeArr[0] = hoursString[0];
      timeArr[1] = hoursString[1];
    } else {
      let twelveHours = hours;

      if (hours > 12) {
        twelveHours = hours - 12;
      }

      if (twelveHours < 10) {
        timeArr[0] = '0';
        timeArr[1] = twelveHours.toString();
      } else {
        timeArr[1] = twelveHours.toString()[1];
        timeArr[1] = hours.toString();
      } 
    }

    timeArr[2] = 'separator';

    if (minutes < 10) {
      timeArr[3] = '0';
      timeArr[4] = minutesString[0];
    } else {
      timeArr[3] = minutesString[0];
      timeArr[4] = minutesString[1];
    }
    
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
