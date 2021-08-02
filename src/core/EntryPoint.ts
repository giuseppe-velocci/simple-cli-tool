import { ClIO } from "./ClIO"
import { Command } from "./models/CommandModels"
import { InputParser } from "./ParamExtractor";
import ParamError from "./models/ParamError";
import { CommandHelpPrinter } from "./HelpPrinter";

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
    helpPrinter: CommandHelpPrinter;
    builtInCommands: Array<Command>

    constructor(
        commands: Array<Command>,
        io: ClIO,
        inputParser: InputParser,
        helpPrinter: CommandHelpPrinter,
        builtInCommands: Array<Command> = [],
    ) {
        this.commands = commands;
        this.io = io;
        this.inputParser = inputParser;
        this.helpPrinter = helpPrinter;
        this.builtInCommands = builtInCommands;
    }

    start() {
        const handleCommand = this.createCommandHandlerMethod(this);
        this.io.readline(handleCommand);
    }

    private createCommandHandlerMethod(instance: EntryPoint): (input: Array<string>) => void {
        return (input: Array<string>) => {
            const extendedCommands = instance.commands.concat(this.builtInCommands)

            const cmdInput = !!input && input[0] ? input[0].toLowerCase() : undefined;
            if (!cmdInput)
                instance.io.error('invalid input');

            const cmd = extendedCommands.find(c => c.name.toLowerCase() == cmdInput);
            if (!cmd)
                instance.io.error('command not found');

            if (this.helpPrinter.isHelpRequestedForSpecificCommand(input)) {
                this.helpPrinter.printHelpForSpecificCommand(cmd);
                return;
            }
            const inputWithoutCommand = input.slice(1);

            const paramsOrError = instance.inputParser.parseInput(inputWithoutCommand, cmd);
            if (paramsOrError instanceof ParamError)
                instance.io.error(paramsOrError.message);

            cmd.action(paramsOrError);
        }
    }
}
