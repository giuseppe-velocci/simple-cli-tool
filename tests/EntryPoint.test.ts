import { ClIO } from '../src/core/ClIO';
import { Command, Flag, Param, PropConstraint, PropType } from '../src/core/CommandModels';
import EntryPointImpl from '../src/core/EntryPoint';
import ParamError from '../src/core/ParamError';
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
            cmdAction(io)
        ),
    ];

    let inputParser: InputParser;

    beforeAll(() => {
       inputParser = new InputParserTest();
    });

    test('should handle command', () => {
        const user = new User();
        user.willInput(['greet -p Io']);
        const io = new ClIOTest(user);

        const commands: Array<Command> = getCommands(io);

        const entryPoint = new EntryPointImpl(commands, io, inputParser);
        entryPoint.start();
        expect(io.printedValues).toStrictEqual(['Hello Io!']);
    });

    test('should print error in output error stream', () => {
        const user = new User();
        user.willInput(['greet']);
        const io = new ClIOTest(user);

        const commands: Array<Command> = getCommands(io);

        const entryPoint = new EntryPointImpl(commands, io, inputParser);
        entryPoint.start();
        expect(io.errorValues).toStrictEqual(['Missing required parameter: person']);
    });
});

class InputParserTest implements InputParser {
    parseInput(input: string, command: Command): Either<ParamError, Record<string, any>> {
        if (input.indexOf('--person') < 0 || input.indexOf('-p') < 0)
            return new ParamError('Missing required parameter: person');

        command.action({ person: 'Io', nighttime: false });
    }
}
