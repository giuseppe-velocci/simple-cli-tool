import { ClIO } from "./ClIO"
import { Command } from "./CommandModels"
import { InputParser } from "./ParamExtractor";
import ParamError from "./ParamError";

class EntryPoint {
    io: ClIO;
    commands: Array<Command>;
    inputParser: InputParser;

    constructor(commands: Array<Command>, io: ClIO, inputParser: InputParser) {
        this.commands = commands;
        this.io = io;
        this.inputParser = inputParser;
    }

    start() {
        this.io.prompt(this.handleCommand);
    }

    private handleCommand(input: string): void {
        const cmdInput = input.trim().split(' ')[0]; // TODO should be in position 0 or 1???
        if(!cmdInput)
            this.io.error('invalid input');
        
        const cmd = this.commands.find(c => c.name == cmdInput);

        if(!cmd)
            this.io.error('command not found');

        const paramsOrError = this.inputParser.parseInput(input, cmd);
        if (paramsOrError instanceof ParamError)
            this.io.error(paramsOrError.message);

        cmd.action(paramsOrError);
    }
}