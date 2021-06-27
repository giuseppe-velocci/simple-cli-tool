import { ClIO } from "./ClIO"
import { Command, Param, Flag, PropConstraint, PropType, CliParam } from "./CommandModels"
import { InputParser } from "./ParamExtractor";
import ParamError from "./ParamError";

export interface EntryPoint {
    commands: Array<Command>;
    io: ClIO;
    inputParser: InputParser;

    start(): void;
}

const minLineSpace = 21;

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

            if (cmdInput === '--help' || cmdInput === '-h') {
                this.printHelpForCommands(instance);
                return;
            }

            const cmd = instance.commands.find(c => c.name == cmdInput);
            if (!cmd)
                instance.io.error('command not found');

            if (this.isHelpRequestedForSpecificCommand(input)){
                this.printHelpForSpecificCommand(cmd);
                return;
            }

            const paramsOrError = instance.inputParser.parseInput(input, cmd);
            if (paramsOrError instanceof ParamError)
                instance.io.error(paramsOrError.message);

            cmd.action(paramsOrError);
        }
    }

    private printHelpForCommands(instance: EntryPoint): void {
        let commandsDescription = 'Commands:\n';
        instance.commands.map(x => {
            commandsDescription += `${x.name.toUpperCase()}`;
            if (commandsDescription.length < minLineSpace)
                commandsDescription += ' '.repeat(minLineSpace - commandsDescription.length);

            commandsDescription += `${x.description}\n`;
        });

        this.io.print(commandsDescription);
    }

    private isHelpRequestedForSpecificCommand(input: string): boolean {
        if (!input.includes('--help') && !input.includes('-h'))
            return false;

        return true;
    }

    private printHelpForSpecificCommand(command: Command): void {
        let commandDescription = `${command.name.toUpperCase()}     ${command.description}\n`;

        commandDescription += (command.params.some(y => y instanceof Param)) ? `\nParameters:\n` : '';
        commandDescription += this.getParamsDescription(command);

        commandDescription += (command.params.some(y => y instanceof Flag)) ? `\nFlags:\n` : '';
        commandDescription += this.getFlagsDescription(command);
    
        this.io.print(commandDescription);
    }

    private getParamsDescription(command: Command): string {
        let commandDescription = '';
        command.params
        .filter(y => y instanceof Param)
        .map(k => {
            const x: Param = k as Param;

            let paramDescription = `[${PropType[x.type].toString()}]`;
            (x.constraint === PropConstraint.None) ? ''
                : paramDescription += ` (${PropConstraint[x.constraint].toString()})`;

            if (paramDescription.length < minLineSpace)
                paramDescription += ' '.repeat(minLineSpace - paramDescription.length);

            commandDescription += paramDescription + this.getParamNameAndDescription(x);
        });
        return commandDescription;
    }

    private getFlagsDescription(command: Command): string {
        let commandDescription = '';
        command.params
        .filter(y => y instanceof Flag)
        .map(x => {
            commandDescription += ' '.repeat(minLineSpace) + this.getParamNameAndDescription(x);
        });
        return commandDescription;
    }
    
    private getParamNameAndDescription(x: CliParam): string {
        const text = '\n' + x.shortName ? `--${x.name} | -${x.shortName}` : `--${x.name}`;
        return text + `     ${x.description}\n`;
    }

}