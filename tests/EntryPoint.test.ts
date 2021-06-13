import { Command, Flag, Param, PropConstraint, PropType } from "../src/core/CommandModels";
import EntryPointImpl, { EntryPoint } from "../src/core/EntryPoint";
import ParamExtractor from "../src/core/ParamExtractor";
import { ClIOTest, User } from "./ClIO.test";

describe('EntryPointImpl', () => {
    test('should handle command', () => {
        const user = new User();
        user.willInput(['greet -p Io']);
        const io = new ClIOTest(user);

        const inputParser = new ParamExtractor(); // better use MOCK

        const commands: Array<Command> = [
            new Command(
                'greet',
                [
                    new Param('person', 'p', PropType.String, PropConstraint.Required, 'person to be greeted'),
                    new Flag('nighttime', 'n', 'if it is night time'),
                ],
                (params) => {
                    io.print(`Hello ${params.person}!`);
                }
            )
        ];

        const entryPoint = new EntryPointImpl(commands, io, inputParser);
        entryPoint.start()
        expect(io.printedValues).toStrictEqual(['Hello Io!']);
    });
});