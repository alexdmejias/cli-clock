# CLI-CLOCK 
 
Cli-Clock is a clock for your terminal. Once you run the program, it will display the current time on your terminal windo and ti will update every thirty seconds. The clock is formed by two characters, which are choosen from a preselected set of characters or passed as arguments by the user. Once the program starts, the application will measure the size of the current terminal window and display the time in the center of the window. * * Example usage:


    $ node cli-clock.js 
    $ node cli-clock.js " " X
    $ node cli-clock.js -b " " -f X
    $ node cli-clock.js -b O -f 🐶 
    $ node cli-clock.js 😁 😡
    $ node cli-clock.js --bc=red --fc=yellow -b=" " -f🐶
    $ node cli-clock.js --bc=red -b=" " -f🐶



