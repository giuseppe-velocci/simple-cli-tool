import { ClIO } from "./ClIO";
import { CliParam, Command, Flag, Param, PropConstraint, PropType } from "./CommandModels";
import EntryPoint from "./EntryPoint";

const minLineSpace = 21;

export interface HelpPrinter {
    printHelpForCommands(commands: Command[]): void;
    isHelpRequestedForSpecificCommand(input: string): boolean;
    printHelpForSpecificCommand(command: Command): void;
}

export default class HelpPrinterImpl implements HelpPrinter {
    io: ClIO;

    constructor(io: ClIO) {
        this.io = io;
    }

    printHelpForCommands(commands: Command[]): void {
        let commandsDescription = 'Commands:\n';
        commands.map(x => {
            commandsDescription += `${x.name.toUpperCase()}`;
            if (commandsDescription.length < minLineSpace)
                commandsDescription += ' '.repeat(minLineSpace - commandsDescription.length);

            commandsDescription += `${x.description}\n`;
        });

        this.io.print(commandsDescription);
    }

    isHelpRequestedForSpecificCommand(input: string): boolean {
        if (!input.includes('--help') && !input.includes('-h'))
            return false;

        return true;
    }

    printHelpForSpecificCommand(command: Command): void {
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
