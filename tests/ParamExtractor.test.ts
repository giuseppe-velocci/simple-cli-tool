import { Command, Flag, Param, PropType, PropConstraint } from '../src/core/models/CommandModels';
import ParamExtractor from '../src/core/ParamExtractor';
import ParamError from '../src/core/models/ParamError';

const command = new Command(
    'cmd',
    [
        new Param('par', 'p', PropType.Integer, PropConstraint.Required, 'par description'),
        new Param('rap', 'r', PropType.String, PropConstraint.None, 'par description'),
        new Param('camelCase', 'c', PropType.Float, PropConstraint.None, 'par description'),
        new Flag('flag', 'f', 'flag description'),
        new Flag('nflag', 'n', 'nflag description'),
        new Flag('camelCaseFlag', 'g', 'gflag description'),
    ],
    ({ params }) => { params; },
    'a test cmd'
);
const target = new ParamExtractor();

describe('ParamExtractor', () => {    
    describe('Param', () => {
        test('should return an error if an invalid parameter is passed after all required params are given', () => {
            const input = '-p 2 non_exisiting'.split(' ');
    
            expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Invalid parameter non_exisiting'));
        });

        test('should not return params with correct type for full name', () => {
            const input = '--par 2'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('par', 2);
        });

        test('should return params with correct type for short name', () => {
            const input = '-p 2'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('par', 2);
        });

        test('Param required constraint should be handled', () => {
            const input = '-r 2'.split(' ');

            expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Missing required parameter: par'));
        });

        test('Params should be case-insensitive', () => {
            const input = '-P 2 --camelcase 1.0'.split(' ');
            const input1 = '--PAR 2 --CAMELCASE 1.0'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('par', 2);
            expect(target.parseInput(input, command)).toHaveProperty('camelCase', 1.0);
            expect(target.parseInput(input1, command)).toHaveProperty('par', 2);
            expect(target.parseInput(input1, command)).toHaveProperty('camelCase', 1.0);
        });

        test('Params arguments should be case-sensitive', () => {
            const input = '-p 2 -r AbCdEf'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('rap', 'AbCdEf');
        });

        test('Params arguments match expected type', () => {
            const input = '-p AbCdEf'.split(' ');

            expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Invalid argument type for param: par, Integer expected'));
        });

        test('Params required arguments should be managed also based on position without param name', () => {
            const commandWith2Required = new Command(
                'cmd',
                [
                    new Param('par', 'p', PropType.Integer, PropConstraint.Required, 'par description'),
                    new Param('rap', 'r', PropType.String, PropConstraint.Required, 'par description'),
                    new Flag('flag', 'f', 'flag description'),
                    new Flag('nflag', 'n', 'nflag description')
                ],
                ({ params }) => { params; },
                'a test cmd'
            );
            const input = '2 AbCdEf -f'.split(' ');
            const input1 = '-r AbCdEf 2 -f'.split(' ');

            expect(target.parseInput(input, commandWith2Required)).toHaveProperty('par', 2);
            expect(target.parseInput(input, commandWith2Required)).toHaveProperty('rap', 'AbCdEf');
            expect(target.parseInput(input, commandWith2Required)).toHaveProperty('flag', true);

            expect(target.parseInput(input1, commandWith2Required)).toHaveProperty('par', 2);
            expect(target.parseInput(input1, commandWith2Required)).toHaveProperty('rap', 'AbCdEf');
            expect(target.parseInput(input1, commandWith2Required)).toHaveProperty('flag', true);
        });

        test('Params duplication should return an error', () => {
            const input = '-p 3 --par 2'.split(' ');
            const input1 = '-p 2 -p 3'.split(' ');

            expect(target.parseInput(input, command)).toStrictEqual(new ParamError('Param: par already existing'));
            expect(target.parseInput(input1, command)).toStrictEqual(new ParamError('Param: par already existing'));
        });
    });

    describe('Flag', () => {
        test('should return flags with a boolean value (false if not passed, true otherwise)', () => {
            const input = '-p 2 --flag'.split(' ');
            const input1 = '-p 2'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('flag', true);
            expect(target.parseInput(input1, command)).toHaveProperty('flag', false);
        });

        test('Flags should always be optional', () => {
            const input = '-p 2'.split(' ');

            expect(target.parseInput(input, command)).toStrictEqual({ camelCaseFlag: false, flag: false, nflag: false, par: 2 });
        });

        test('Flags should be chainable in one single flag', () => {
            const input = '-p 1 -fn'.split(' ');

            expect(target.parseInput(input, command)).toStrictEqual({ camelCaseFlag: false, flag: true, nflag: true, par: 1 });
        });

        test('Flags should be case-insensitive', () => {
            const input = '-p 2 --FLAG --CAMELCASEFLAG'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('flag', true);
            expect(target.parseInput(input, command)).toHaveProperty('camelCaseFlag', true);
        });

        test('Flags order over non required params should not change result', () => {
            const input = '-p 2 --flag -r abc'.split(' ');

            expect(target.parseInput(input, command)).toHaveProperty('flag', true);
            expect(target.parseInput(input, command)).toHaveProperty('par', 2);
            expect(target.parseInput(input, command)).toHaveProperty('rap', 'abc');
        });
    });
});