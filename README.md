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

## What will be the name of my command?
Executable file created by pkg will be named as the entry point of the application, so it will be *index* for current implementation.
The script *./rename.js* will read `name` property from *package.json* and rename executable file with that value. An npm script is already configured for this task: `rename-exec-file`.

In order to customize this name this is the process applied and suggested:
- name your node project as the command you would like to run on cli (please NO spaces)
Then, based on the way used to configure package building process:
- if using `npm run pack`: no action needed, `rename-exec-file` is run as last action
- if providing a custom configuratio, ensure to run `npm run rename-exec-file` at the end

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
- [ ] version command (fix case when package.json is not in folder)
- [x] allow renaming executable file from "name" attribute in package.json
- [ ] allow reading required parameters positionally
- [ ] implement excluding constraint
- [ ] array values (with types?)