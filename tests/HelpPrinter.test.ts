import HelpPrinterImpl from "../src/core/HelpPrinter";
import { Command, Flag, Param, PropConstraint, PropType } from "../src/core/models/CommandModels";
import { ClIOTest, User } from "./ClIO.test";

const user = new User();
const io = new ClIOTest(user);
const commands = [new Command(
    'greet',
    [
        new Param('person', 'p', PropType.String, PropConstraint.Required, 'person to be greeted'),
        new Flag('nighttime', 'n', 'if it is night time'),
    ],
    (_) => {},
    'greet a specific person'
),];
const target = new HelpPrinterImpl(io, commands);

describe('HelpPrinterImpl', () => {
    test('should handle help command at top level', () => {
        target.printHelpForCommands();
        expect(io.printedValues).toStrictEqual(['Commands:\nGREET      greet a specific person\n']);
    });
});