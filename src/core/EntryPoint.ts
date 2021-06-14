import { ClIO } from "./ClIO"
import { Command } from "./CommandModels"
import { InputParser } from "./ParamExtractor";
import ParamError from "./ParamError";

export interface EntryPoint {
    commands: Array<Command>;
    io: ClIO;
    inputParser: InputParser;

    start(): void;
}

export default class EntryPointImpl implements EntryPoint {
    commands: Array<Command>;
    io: ClIO;
    inputParser: InputParser;

    constructor(commands: Array<Command>, io: ClIO, inputParser: InputParser) {
        this.commands = commands;
        this.io = io;
        this.inputParser = inputParser;
    }

    start() {
        const handleCommand = this.createCommandHandlerMethod(this);
        this.io.readline(handleCommand);
    }

    private createCommandHandlerMethod(instance: EntryPoint): (input: string) => void {
        return (input: string) => {
            const cmdInput = input.trim().toLowerCase().split(' ')[0]; // TODO should be in position 0 or 1???
            if (!cmdInput)
                instance.io.error('invalid input');
            const cmd = instance.commands.find(c => c.name == cmdInput);

            if (!cmd)
                instance.io.error('command not found');

            const paramsOrError = instance.inputParser.parseInput(input, cmd);
            if (paramsOrError instanceof ParamError)
                instance.io.error(paramsOrError.message);

            cmd.action(paramsOrError);
        }
    }
}