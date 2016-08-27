# CLI-CLOCK 

## Installation

`> npm install cli-clock -g`

Cli-Clock is a clock for your terminal. Once you run the program, it will display the current time on your terminal windo and ti will update every thirty seconds. The clock is formed by two characters, which are choosen from a preselected set of characters or passed as arguments by the user. Once the program starts, the application will measure the size of the current terminal window and display the time in the center of the window. * * Example usage:

## Usage

    Usage: cli-clock [options]

    Options:

        -h, --help                    output usage information
        -V, --version                 output the version number
        -b, --background [character]  baground character
        -f, --foreground [character]  foreground characters color
        -c, --colors [item(s)]        characters colors for the foreground and background, respectively
        -t, --twelve-hours            twelve hour format

## Examples

    $ cli-clock 
    $ cli-clock -b " " -f "X"
    $ cli-clock -b " " -f X
    $ cli-clock -b O -f 🐶 
    $ cli-clock -b O -f X -c "red,green" 
    $ cli-clock -b O -f X -c "red,green" -t

![screenshot](https://github.com/amejias101/cli-clock/raw/master/screenshot.png "First screenshot")