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

function getRandom(arr) {
  return Math.floor(Math.random() * arr.length);
}

function Clock() {
  if (process.stdout.rows) {
    this.rows = process.stdout.rows;
    this.columns = process.stdout.columns;
  } else {
    this.rows = 20;
    this.columns = 50;
  }

	this.availableNumbers = {
		'5x8': [
			['11111', '10001', '10001', '10001', '10001', '10001', '10001', '11111'], // 0 
			['00001', '00001', '00001', '00001', '00001', '00001', '00001', '00001'], // 1
			['01110', '10001', '00001', '00010', '00100', '01000', '10000', '11111'], // 2
			['11111', '00001', '00001', '01111', '00001', '00001', '00001', '11111'], // 3
			['00110', '01010', '01010', '10010', '11111', '00010', '00010', '00010'], // 4
			['11111', '10000', '10000', '11110', '00001', '00001', '00001', '11110'], // 5
			['11111', '10000', '10000', '11111', '10001', '10001', '10001', '11111'], // 6
			['11111', '00001', '00010', '00100', '00100', '01000', '01000', '10000'], // 7
			['11111', '10001', '10001', '11111', '10001', '10001', '10001', '11111'], // 8
			['11111', '10001', '10001', '11111', '00001', '00001', '00001', '00001'], // 9
			['00000', '00000', '00100', '00000', '00000', '00100', '00000', '00000']  // :
		]
	};

	this.availableSets = [['•','X'], ['\\', '/'], ['-', '_'], ['0', '1'], [' ', '█']];

	this.numbersToUse = this.availableNumbers['5x8'];

	this.currentSet = this.availableSets[getRandom(this.availableSets)];


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

// returns the size of the first character in a set
Clock.prototype.getLetterDimensions = function(character) {
	return {
		width: character[0].split('').length,
		height: character.length,
		padding: 1
	}
}

Clock.prototype.getTotalWidth = function(numberSet) {
	const letterDimensions = this.getLetterDimensions(numberSet[0]);
	return (letterDimensions.width + (letterDimensions.padding * 2)) * 5;
}

Clock.prototype.getTotalHeight = function(numberSet) {
	const letterDimensions = this.getLetterDimensions(numberSet[0]);
	return (letterDimensions.height + (letterDimensions.padding * 2));
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
  const characterDimensions = this.getLetterDimensions(this.numbersToUse[0]);
	const totalTextWidth = this.getTotalWidth(this.numbersToUse);
	const totalTextHeight = this.getTotalHeight(this.numbersToUse);

	const terminalHorCenter = Math.floor(this.columns / 2); 
	const terminalOffset = terminalHorCenter - Math.floor(totalTextWidth / 2);
	
	const terminalVerCenter = Math.floor(this.rows / 2);
	const terminalVerOffset = terminalVerCenter - (characterDimensions.height / 2); 

	const numToDisplay = this.getTime();

	for (var h = 0; h < numToDisplay.length; h++) { // cycle through the time numbers
		const leftIndex = (h * (characterDimensions.width + (characterDimensions.padding * 2))) + terminalOffset;

		for (var i = 0; i < characterDimensions.height; i++) { // cycle through the height of the numbers
			const thisRow = this.numbersToUse[numToDisplay[h]][i].split(''); // the row from the number to cycle through
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
	const timeArr = d.toTimeString().slice(0, 5).split('');

	// convert the strings numbers into numbers
	timeArr.map((curr, i) => {
		timeArr[i] = parseInt(curr, 10);
	});

	// replace the colon with the colon index from the font array
	timeArr[2] = 10;
	return timeArr;
}

/**
 * Update the buffer
 */
Clock.prototype.update = function() {
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


// LAUNCH

const clock = new Clock();

clock.update();
clock.draw();

setInterval(() => {
	clock.update();
	clock.draw();
}, 30000);