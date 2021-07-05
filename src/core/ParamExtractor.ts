import { Command, CliParam, Param, Flag, PropType, PropConstraint } from "./models/CommandModels";
import ParamError from "./models/ParamError";

export type Either<L, R> = L | R;

export interface InputParser {
    parseInput(input: string, command: Command): Either<ParamError, Record<string, any>>
}

export default class ParamExtractor implements InputParser {
    argsInputDelimiter: string = '-';
    argsSplitDelimiter: string = '_';
    argsFullNameInputDelimiter: string;
    argsFullNameSplitDelimiter: string;

    constructor() {
        this.argsFullNameInputDelimiter = this.argsInputDelimiter.repeat(2);
        this.argsFullNameSplitDelimiter = this.argsInputDelimiter + this.argsSplitDelimiter;
    }

    // command is matched by another method: this one only handles param extraction
    parseInput(input: string, command: Command): Either<ParamError, Record<string, any>> {
        const cliArguments = {};

        const splitInput: Array<string> = this.normalizeInput(input, command);
        const matchError = splitInput.map(x => this.findAndStoreParam(command, cliArguments, x));
        if (matchError[0])
            return matchError[0];

        // add missing flags as false
        this.storeFlagsDefaultValue(command, cliArguments);

        // check for Required param constraint
        const missingRequiredParamError = this.findMissingRequiredParams(command, cliArguments);
        if (missingRequiredParamError)
            return missingRequiredParamError;

        return cliArguments;
    }

    private normalizeInput(input: string, command: Command): Array<string> {
        return input.replace(RegExp(command.name, 'i'), '')
            .trim()
            .replace(this.argsFullNameInputDelimiter, this.argsFullNameSplitDelimiter)
            .split(this.argsInputDelimiter)
            .filter(x => x !== '');
    }

    private findAndStoreParam(command: Command, cliArguments: Record<string, any>, segment: string): ParamError {
        const [param, value] = segment.trim().split(' ');

        // match by extended or short name
        const paramString = (
            (param.charAt(0) === this.argsSplitDelimiter) ?
                param.substring(1) :
                param
        ).toLowerCase();

        const matchingFunction = (param.charAt(0) === this.argsSplitDelimiter) ?
            ((x: CliParam) => x.name === paramString) :
            ((x: CliParam) => x.shortName === paramString);

        const paramObject = command.params.find(matchingFunction);
        if (!paramObject) {
            // search for chained flags, if not found return error
            const chainedFlagError = this.findChainedFlags(command, cliArguments, paramString);
            if (chainedFlagError)
                return chainedFlagError;
        }

        this.storeArguments(cliArguments, paramObject, value);
        return undefined;
    };

    private findMissingRequiredParams(command: Command, cliArguments: Record<string, any>): ParamError {
        const missingRequiredParam = command.params.find(cliParam => cliParam instanceof Param &&
            cliParam.constraint === PropConstraint.Required &&
            !cliArguments[cliParam.name])
        if (missingRequiredParam)
            return new ParamError(`Missing required parameter: ${missingRequiredParam.name}`);
        return undefined;
    }

    private findChainedFlags(command: Command, cliArguments: Record<string, any>, paramString: string): ParamError {
        let unhandledInput: string = paramString;
        const flagsWithShortName = command.params
            .filter(x => x instanceof Flag && x.shortName.length > 0);

        flagsWithShortName.map(x => {
            unhandledInput = unhandledInput.replace(x.shortName, '');
            this.storeArguments(cliArguments, x);
        });

        if (unhandledInput.length > 0)
            return new ParamError(`Invalid parameter ${encodeURI(paramString)}`);

        return undefined;
    }

    private storeFlagsDefaultValue(command: Command, cliArguments: Record<string, any>): void {
        command.params.filter(cliParam => cliParam instanceof Flag && !cliArguments[cliParam.name])
            .map((flag) => this.storeArguments(cliArguments, flag, 'false'));
    }

    private storeArguments(cliArguments: object, cliParam: CliParam, value?: string): void {
        if (cliParam instanceof Param) {
            switch (cliParam.type) {
                case PropType.Integer:
                    cliArguments[cliParam.name] = parseInt(value);
                    break;
                case PropType.Float:
                    cliArguments[cliParam.name] = parseFloat(value);
                    break;
                case PropType.String:
                    cliArguments[cliParam.name] = value;
                    break;
                // TODO arrays
            }
        } else if (cliParam instanceof Flag) {
            cliArguments[cliParam.name] = value === 'false' ? false : true;
        } else {
            //... TODO error
        }
    }

}
