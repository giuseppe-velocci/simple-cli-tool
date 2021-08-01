import { ClIO } from '../src/core/ClIO';
import { Command, Flag, Param, PropConstraint, PropType } from '../src/core/models/CommandModels';
import EntryPointImpl from '../src/core/EntryPoint';
import { CommandHelpPrinter } from '../src/core/HelpPrinter';
import ParamError from '../src/core/models/ParamError';
import { Either, InputParser } from '../src/core/ParamExtractor';
import { ClIOTest, User } from './ClIO.test';

describe('EntryPointImpl', () => {
    const cmdAction = (io: ClIO): (params) => void => {
        return (_) => {
            io.print('Hello Io!');
        }
    }

    const getCommands = (io: ClIO): Array<Command> => [
        new Command(
            'greet',
            [
                new Param('person', 'p', PropType.String, PropConstraint.Required, 'person to be greeted'),
                new Flag('nighttime', 'n', 'if it is night time'),
            ],
            cmdAction(io),
            'greet a specific person'
        ),
    ];

    const getEntryPoint = (io: ClIO): EntryPointImpl => {
        const commands: Array<Command> = getCommands(io);
        const inputParser = new InputParserTest();
        const helpPrinter = new HelpPrinterTest(io);
        const builtInCommands = [new Command('custom', [], (_) => io.print('custom'))];
        return new EntryPointImpl(commands, io, inputParser, helpPrinter, builtInCommands);
    }

    test('should handle command', () => {
        const user = new User();
        user.willInput(['greet -p Io']);
        const io = new ClIOTest(user);
        const entryPoint = getEntryPoint(io);

        entryPoint.start();
        expect(io.printedValues).toStrictEqual(['Hello Io!']);
    });

    test('should handle a built in command', () => {
        const user = new User();
        user.willInput(['custom']);
        const io = new ClIOTest(user);
        const entryPoint = getEntryPoint(io);

        entryPoint.start();
        expect(io.printedValues).toStrictEqual(['custom']);
    });

    test('should handle --help flag for a command', () => {
        const user = new User();
        user.willInput(['greet --help']);
        const io = new ClIOTest(user);
        const entryPoint = getEntryPoint(io);

        entryPoint.start();
        expect(io.printedValues).toStrictEqual(['GREET     greet a specific person\n\nParameters:\n[String] (Required)  --person | -p     person to be greeted\n\nFlags:\n                     --nighttime | -n     if it is night time\n']);
    });

    test('should handle -h short help flag for a command', () => {
        const user = new User();
        user.willInput(['greet -h']);
        const io = new ClIOTest(user);
        const entryPoint = getEntryPoint(io);

        entryPoint.start();
        expect(io.printedValues).toStrictEqual(['GREET     greet a specific person\n\nParameters:\n[String] (Required)  --person | -p     person to be greeted\n\nFlags:\n                     --nighttime | -n     if it is night time\n']);
    });

    test('should print error in output error stream', () => {
        const user = new User();
        user.willInput(['greet']);
        const io = new ClIOTest(user);
        const entryPoint = getEntryPoint(io);

        entryPoint.start();
        expect(io.errorValues).toStrictEqual(['Missing required parameter: person']);
    });
});

class InputParserTest implements InputParser {
    parseInput(input: Array<string>, command: Command): Either<ParamError, Record<string, any>> {
        if (input.indexOf('--person') < 0 || input.indexOf('-p') < 0)
            return new ParamError('Missing required parameter: person');

        command.action({ person: 'Io', nighttime: false });
    }
}

class HelpPrinterTest implements CommandHelpPrinter {
    io: ClIO;

    constructor(io: ClIO) {
        this.io = io;
    }

    isHelpRequestedForSpecificCommand(input: Array<string>): boolean {
        if (!input.includes('--help') && !input.includes('-h'))
            return false;

        return true;
    }

    printHelpForSpecificCommand(command: Command): void {
        this.io.print('GREET     greet a specific person\n\nParameters:\n[String] (Required)  --person | -p     person to be greeted\n\nFlags:\n                     --nighttime | -n     if it is night time\n');
    }
}
