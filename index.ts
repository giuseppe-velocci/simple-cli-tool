import { Command, Flag, Param, PropConstraint, PropType } from './src/core/CommandModels';
import EntryPoint from './src/core/EntryPoint';
import { ClIOImpl } from './src/core/ClIO';
import ParamExtractor from './src/core/ParamExtractor';

const io = ClIOImpl.getInstance();
const inputParser = new ParamExtractor();

// test commands, ideally moved to extrenal files
const commands: Array<Command> = [
    new Command(
    'greet',
    [
        new Param('person', 'p', PropType.String, PropConstraint.Required, 'person to be greeted'),
        new Flag('nighttime', 'n', 'if it is night time'),
    ],
    (params) => {
        io.print(`Hello ${params.person}`);
    }
)
];

const entryPoint = new EntryPoint(commands, io, inputParser);

entryPoint.start();