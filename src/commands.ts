import { ClIOImpl } from "./core/ClIO";
import { Command, Flag, Param, PropConstraint, PropType } from "./core/CommandModels";

const io = ClIOImpl.getInstance();

export const commands: Array<Command> = [
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