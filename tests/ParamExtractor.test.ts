import { Command, Flag, Param, PropType, PropConstraint } from '../src/core/CommandModels';
import ParamExtractor, { ParamError } from '../src/core/ParamExtractor';

const command = new Command(
    'cmd',
    [
        new Param('par', 'p', PropType.Integer, PropConstraint.Required, 'par description'),
        new Param('rap', 'r', PropType.Integer, PropConstraint.None, 'par description'),
        new Flag('flag', 'f', 'flag description'),
        new Flag('nflag', 'n', 'nflag description')
    ],
    ({ params }) => { params; }
);
const target = new ParamExtractor();

describe('ParamExtractor', () => {
    test('Should return an error if an invalid string is passed', () => {
        const input = '';
        expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Invalid expression'));
    });

    test('Should return an error if an invalid parameter is passed', () => {
        const input = '--non_exisiting';
        expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Invalid parameter non_exisiting'));
    });

    describe('Param', () => {
        test('should return params with correct type for full name', () => {
            const input = '--par 2';

            expect(target.parseInput(input, command)).toHaveProperty('par', 2);
        });

        test('should return params with correct type for short name', () => {
            const input = '-p 2';

            expect(target.parseInput(input, command)).toHaveProperty('par', 2);
        });

        test('Param required constraint should be handled', () => {
            const input = '-r 2';

            expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Missing required parameter: par'));
        });
    });

    describe('Flag', () => {
        test('should return flags with a boolean value (false if not passed, true otherwise)', () => {
            const input = '--flag -p 2';

            expect(target.parseInput(input, command)).toHaveProperty('flag', true);
        });

        test('Flags should always be optional', () => {
            const input = '-p 2';

            expect(target.parseInput(input, command)).toStrictEqual({ flag: false, nflag: false, par: 2 });
        });

        test('Flags should be chainable in one single flag', () => {
            const input = '-fn';

            expect(target.parseInput(input, command)).toContain({ flag: false });
        });
    });
});