import { Command, Flag, Param, PropConstraint, PropType } from './src/core/CommandModels';
import EntryPoint from './src/core/EntryPoint';
import { ClIOImpl } from './src/core/ClIO';
import ParamExtractor from './src/core/ParamExtractor';
import HelpPrinterImpl from './src/core/HelpPrinter';
import VersionPrinterImpl from './src/core/VersionPrinter';

const io = ClIOImpl.getInstance();
const inputParser = new ParamExtractor();
const helpPrinter = new HelpPrinterImpl(io);
const versionPrinter = new VersionPrinterImpl(io);

// test commands, ideally moved to external files
const commands: Array<Command> = [
    new Command(
    'greet',
    [
        new Param('person', 'p', PropType.String, PropConstraint.Required, 'person to be greeted'),
        new Flag('nighttime', 'n', 'if it is night time'),
    ],
    (params) => {
        const { person, nighttime } = params;
        if (nighttime === true)
            io.print(`Goodnight ${person}`);
        else
            io.print(`Hello ${person}`);
    },
    'say hello to a specific person at a specific time of the day'
)
];

const entryPoint = new EntryPoint(commands, io, inputParser, helpPrinter, versionPrinter);

entryPoint.start();