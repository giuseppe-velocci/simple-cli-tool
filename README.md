# simple-cli-tool
A simple helper to create command line tools

## Prerequisites
- node (min. version 12)
- [pkg](https://www.npmjs.com/package/pkg) globally installed

  `npm i -g pkg`

## Create an executable app
To create an executable file that targets os of your machine:
- run from a terminal pointing to this project folder:

  `npm run build`

The application will be saved in *./dist/bin* folder. If needed, `pkg` attribute is already inside *package.json*ready to be further customized and configure the build that you need.
**Please do not change `outputPath` as it can be a breaking change for other operations.**

## What will be the name of my command?
Executable file created by pkg will be named as the entry point of the application, so it will be *index* for current implementation.
The script *./rename.js* will read `name` property from *package.json* and rename executable file with that value. An npm script is already configured for this task: `rename-exec-file`.

In order to customize your cli command name, assign your node project the same name as the command you would like to run on cli (please NO spaces). Then, `npm run build` will take care of handling this procedure for you.

## Run the executable from a terminal in any directory
Add the filepath to the executable to the PATH env variable of your system, than start a new terminal and input the name of the executable (without extension) followed by commands and optionally parameters for it to run.
 Example:

 `$ app greet -p Mary`


## Run from node
To run the application from node without publishing an executable:
- run from a terminal pointing to this project folder:

  `npm run start`

A command prompt will be waiting fr your commands. Plese do keep in mind:
- input just the command to test, not application name
- prompt will be closed after each command as for executable

## How to add custom commands?
There are some sample commands in file *./src/commands.ts*. They should provide guidance on how to create a list of `Commands`, also specifying `Params` and `Flags` for each of them. 
For an easy startup just replace the commands inside the array with the new ones (with methods ideally declared in external files).

 ## Get help
 If help is needed at top level typing `help` will print the list of available commands with a short description.
 Instead typing `--help` or `-h` flag after a valid command will print the detail for command parameters and flags.

 ## Get version
To print program version (will be read from *version* argument inside *package.json*) at top level type `version`.

## ROADMAP:
- [x] help flag/command to display info over commands
- [x] change logic for ClIO read to comply with direct usage from a cli
- [x] version command
- [x] allow renaming executable file from "name" attribute in package.json
- [ ] quit command
- [ ] allow reading required parameters positionally
- [ ] implement excluding constraint
- [ ] array values (with types?)