"use strict";
var utils = require('./utilities');
var colors = require('cli-color');
var clear = require('cli-clear');
var moment = require('moment');
var fonts_1 = require('./fonts');
var Clock = (function () {
    function Clock(args) {
        this.availableSets = [['•', 'X'], ['\\', '/'], ['-', '_'], ['0', '1'], [' ', '█']];
        this.fc = 'white';
        this.bc = 'black';
        this.twelveHourFormat = true;
        this.buffer = [];
        this.setSize();
        this.setColors(args);
        this.setSet(args);
        this.setFont();
        this.setFormat(args);
    }
    Clock.prototype.setColors = function (args) {
        if (args.colors) {
            if (colors[args.colors[0]]) {
                this.fc = args.colors[0];
            }
            if (colors[args.colors[1]]) {
                this.bc = args.colors[1];
            }
        }
    };
    Clock.prototype.setFont = function () {
        this.font = fonts_1.default.fiveByEight;
    };
    Clock.prototype.setFormat = function (args) {
        this.twelveHourFormat = args.twelveHours;
    };
    /**
     * Sets the set of characters to use for both the foreground
     * and background
     */
    Clock.prototype.setSet = function (args) {
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
    };
    Clock.prototype.setSize = function () {
        if (process.stdout.rows && process.stdout.rows) {
            this.rows = process.stdout.rows;
            this.columns = process.stdout.columns;
        }
        else {
            this.rows = 20;
            this.columns = 50;
        }
    };
    // returns the size of the first character in a set
    Clock.prototype.getLetterDimensions = function (character) {
        return {
            height: character.length,
            padding: 1,
            width: character[0].split('').length
        };
    };
    Clock.prototype.getTotalWidth = function () {
        return (this.font.width + (this.font.padding * 2)) * 5;
    };
    Clock.prototype.getTotalHeight = function () {
        return (this.font.height + (this.font.padding * 2));
    };
    /**
     * Fill the background with zeros aka the background character
     */
    Clock.prototype.setBg = function () {
        // cycle through all the columns putting a zero on every column
        // rows then columns
        this.buffer = [];
        for (var i = 0; i < this.rows; i++) {
            this.buffer[i] = [];
            for (var h = 0; h < this.columns; h++) {
                this.buffer[i][h] = 0;
            }
        }
    };
    /**
     * Replace the appropriate background characters with the foreground ones
     */
    Clock.prototype.setFg = function () {
        var totalTextWidth = this.getTotalWidth();
        var terminalHorCenter = Math.floor(this.columns / 2);
        var terminalOffset = terminalHorCenter - Math.floor(totalTextWidth / 2);
        var terminalVerCenter = Math.floor(this.rows / 2);
        var terminalVerOffset = terminalVerCenter - (this.font.height / 2);
        var numToDisplay = this.getTime();
        var startingLeftIndex = 0;
        if (numToDisplay.length === 4) {
            terminalOffset += this.font.width;
        }
        // cycle through the time numbers
        for (var h = startingLeftIndex; h < numToDisplay.length; h++) {
            var leftIndex = (h * (this.font.width + (this.font.padding * 2))) + terminalOffset;
            // cycle through the height of the numbers
            for (var i = 0; i < this.font.height; i++) {
                // the row from the number to cycle through
                var currentChar = this.font.characters[numToDisplay[h]];
                var thisRow = currentChar[i].split('');
                // replace the sections of the buffer with the section from the number
                (_a = this.buffer[terminalVerOffset + i]).splice.apply(_a, [leftIndex, thisRow.length].concat(thisRow));
            }
        }
        var _a;
    };
    /**
     * Helper to Clear out the background
     */
    Clock.prototype.clear = function () {
        clear();
    };
    /**
     * Get the numbers that will be displayed. Will come from the time object
     */
    Clock.prototype.getTime = function () {
        var timeArr;
        var timeFormat = 'HH:mm';
        var separatorIndex = 2;
        if (this.twelveHourFormat) {
            timeFormat = 'h:mm';
            separatorIndex = 1;
        }
        timeArr = moment().format(timeFormat).split('');
        timeArr[separatorIndex] = 'separator';
        return timeArr;
    };
    /**
     * Update the buffer
     */
    Clock.prototype.update = function () {
        this.setSize();
        this.setBg();
        this.setFg();
    };
    /**
     * draw out the buffer
     */
    Clock.prototype.draw = function () {
        var _this = this;
        var toPaint = '';
        this.buffer.forEach(function (row) {
            var currentRow = row.reduce(function (prev, curr) {
                return prev + _this.currentSet[curr];
            }, '');
            toPaint += '\n' + currentRow;
        });
        this.clear();
        process.stdout.write(toPaint);
    };
    return Clock;
}());
module.exports = Clock;
//# sourceMappingURL=index.js.map