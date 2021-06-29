# simple-cli-tool
A simple helper to create command line tools

## Prerequisites
- node (min. version 12)
- [pkg](https://www.npmjs.com/package/pkg) globally installed

  `npm i -g pkg`

## Create an executable app
To create an executable file that targets os of your machine:
- run from a terminal pointing to this project folder:

  `npm run pack`

The application will be saved in *./dist/bin* folder

or use directly pkg to configure the build that you need.

## Run the executable from a terminal in any directory
Add the filepath to the executable to the PATH env variable of your system, than start a new terminal and input the name of the executable (without extension) followed by commands and optionally parameters for it to run.
 Example:

 `$ app greet -p Mary`

 ## Get help
 If help is needed at top level typing `help` or `-h` will print the list of available commands with a short description.
 Instead typing `--help` or `-h` flag after a valid command will print the detail for command parameters and flags.

 ## Get version
To print program version (will be read from *version* argument inside *package.json*) at top level type `version` or `-v`.

## ROADMAP:
- [x] help flag/command to display info over commands
- [x] change logic for ClIO read to comply with direct usage from a cli
- [x] version command (flag?)
- [ ] allow rename for executable file from an attribute in package.json
- [ ] array values (with types?)