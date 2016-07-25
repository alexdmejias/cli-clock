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
 * $ node cli-clock.js O 🐶 
 * $ node cli-clock.js 😁 😡
 * 
 * 
 */

const utils = require('./utilities');
const colors = require('cli-color');
const fonts = require('./fonts');

function Clock() {
	this.setSize();

	this.availableSets = [['•','X'], ['\\', '/'], ['-', '_'], ['0', '1'], [' ', '█']];

	this.numbersToUse = fonts.fiveByEight;

	this.currentSet = this.availableSets[utils.getRandom(this.availableSets)];

	if (process.argv[2] && process.argv[3]) {
		this.currentSet = process.argv.slice(2, 4);
	} else {
		// randomly reverse the array, so we can have a random BG and FG
		if (Math.round(Math.random())) {
			this.currentSet = this.currentSet.reverse();
		}
	}
	
	this.buffer = [];

	for (let i = 0; i < this.rows; i++) {
		this.buffer[i] = [];
		for (let h = 0; h < this.columns; h++) {
			this.buffer[i][h] = 0;
		}
	}
}

Clock.prototype.setSize = function() {
	if (process.stdout.rows && process.stdout.rows) {
    this.rows = process.stdout.rows;
    this.columns = process.stdout.columns;
  } else {
    this.rows = 20;
    this.columns = 50;
  }
}

// returns the size of the first character in a set
Clock.prototype.getLetterDimensions = function(character) {
	return {
		width: character[0].split('').length,
		height: character.length,
		padding: 1
	}
}

Clock.prototype.getTotalWidth = function() {
	return (this.numbersToUse.width + (this.numbersToUse.padding * 2)) * 5;
}

Clock.prototype.getTotalHeight = function(numberSet) {
	return (this.numbersToUse.height + (this.numbersToUse.padding * 2));
}

/**
 * Fill the background with zeros aka the background character
 */
Clock.prototype.setBg = function() {
	// cycle through all the columns putting a zero on every column
	this.buffer.map((curr, i) => {
		this.buffer[i].fill(0);
	});
}

/**
 * Replace the appropriate background characters with the foreground ones
 */
Clock.prototype.setFg = function(numbers) {
	const totalTextWidth = this.getTotalWidth();
	const totalTextHeight = this.getTotalHeight();

	const terminalHorCenter = Math.floor(this.columns / 2); 
	const terminalOffset = terminalHorCenter - Math.floor(totalTextWidth / 2);
	
	const terminalVerCenter = Math.floor(this.rows / 2);
	const terminalVerOffset = terminalVerCenter - (this.numbersToUse.height / 2); 

	const numToDisplay = this.getTime();

	for (var h = 0; h < numToDisplay.length; h++) { // cycle through the time numbers
		const leftIndex = (h * (this.numbersToUse.width + (this.numbersToUse.padding * 2))) + terminalOffset;

		for (var i = 0; i < this.numbersToUse.height; i++) { // cycle through the height of the numbers
			const thisRow = this.numbersToUse.characters[numToDisplay[h]][i].split(''); // the row from the number to cycle through
			
			this.buffer[terminalVerOffset + i].splice(leftIndex, thisRow.length, ...thisRow); // replace the sections of the buffer with the section from the number
		}
	}
}

/**
 * Helper to Clear out the background
 */
Clock.prototype.clear = function() {
	console.log('\033c');
}

/**
 * Get the numbers that will be displayed. Will come from the time object 
 */
Clock.prototype.getTime = function() {
	const d = new Date();
	const timeArr: string[] = d.toTimeString().slice(0, 5).split('');

	// replace the colon with the colon index from the font array
	timeArr[2] = 'separator';
	return timeArr;
}

/**
 * Update the buffer
 */
Clock.prototype.update = function() {
	this.setSize();
	this.setBg();
	this.setFg();
}

/**
 * draw out the buffer
 */
Clock.prototype.draw = function() {
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


module.exports = Clock;