import { ClIO } from "./ClIO"
import { Command } from "./CommandModels"
import { InputParser } from "./ParamExtractor";
import ParamError from "./ParamError";
import { HelpPrinter } from "./HelpPrinter";
import { VersionPrinter } from "./VersionPrinter";

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
    helpPrinter: HelpPrinter;
    versionPrinter: VersionPrinter;

    constructor(
        commands: Array<Command>,
        io: ClIO,
        inputParser: InputParser,
        helpPrinter: HelpPrinter,
        versionPrinter: VersionPrinter,
    ) {
        this.commands = commands;
        this.io = io;
        this.inputParser = inputParser;
        this.helpPrinter = helpPrinter;
        this.versionPrinter = versionPrinter;
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

            if (cmdInput === 'help' || cmdInput === '-h') {
                this.helpPrinter.printHelpForCommands(instance.commands);
                return;
            }

            if (cmdInput === 'version' || cmdInput === '-v') {
                this.versionPrinter.printVersion();
                return;
            }

            const cmd = instance.commands.find(c => c.name == cmdInput);
            if (!cmd)
                instance.io.error('command not found');

            if (this.helpPrinter.isHelpRequestedForSpecificCommand(input)) {
                this.helpPrinter.printHelpForSpecificCommand(cmd);
                return;
            }

            const paramsOrError = instance.inputParser.parseInput(input, cmd);
            if (paramsOrError instanceof ParamError)
                instance.io.error(paramsOrError.message);

            cmd.action(paramsOrError);
        }
    }
}