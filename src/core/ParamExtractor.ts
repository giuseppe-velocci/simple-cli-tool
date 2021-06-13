import { Command, CliParam, Param, Flag, PropType, PropConstraint } from "./CommandModels";

export type Either<L, R> = L | R;

export default class ParamExtractor {
    argsInputDelimiter: string = '-';
    argsSplitDelimiter: string = '_';
    argsFullNameInputDelimiter: string;
    argsFullNameSplitDelimiter: string;

    constructor() {
        this.argsFullNameInputDelimiter = this.argsInputDelimiter.repeat(2);
        this.argsFullNameSplitDelimiter = this.argsInputDelimiter + this.argsSplitDelimiter;
    }

    // command is matched by another method: this one only handles param extraction
    parseInput(input: string, command: Command): Either<ParamError, object> {
        const cliArguments = {};
       
        if (!input)
            return new ParamError('Invalid expression');

        const splitInput: Array<string> = this.normalizeInput(input);

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

    private normalizeInput(input: string): Array<string> {
        return input.replace(this.argsFullNameInputDelimiter, this.argsFullNameSplitDelimiter)
        .split(this.argsInputDelimiter)
        .filter(x => x !== '');
    }
       
    private findAndStoreParam(command: Command, cliArguments: object, segment: string): ParamError {
        const [param, value] = segment.trim().split(' ');

        // match by extended or short name
        const paramString = (param.charAt(0) === this.argsSplitDelimiter) ?
            param.substring(1) :
            param;

        const matchingFunction = (param.charAt(0) === this.argsSplitDelimiter) ?
            ((x: CliParam) => x.name === paramString) :
            ((x: CliParam) => x.shortName === paramString);

        const paramObject = command.params.find(matchingFunction);
        if (!paramObject)
            return new ParamError(`Invalid parameter ${encodeURI(paramString)}`);

        this.storeArguments(cliArguments, paramObject, value);
        return undefined;
    };

    private findMissingRequiredParams(command: Command, cliArguments: object): ParamError {
        const missingRequiredParam = command.params.find(cliParam => cliParam instanceof Param &&
            cliParam.constraint === PropConstraint.Required &&
            !cliArguments[cliParam.name])
        if (missingRequiredParam)
            return new ParamError(`Missing required parameter: ${missingRequiredParam.name}`);
        return undefined;
    }

    private findChainedFlags(args: Array<string>): object {


        return {};
    }

    private storeFlagsDefaultValue(command: Command, cliArguments: object): void {
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
            }
        } else if (cliParam instanceof Flag) {
            cliArguments[cliParam.name] = value === 'false' ? false : true;
        } else {
            //... TODO error
        }
    }

}

export class ParamError extends Error {
    constructor(message: string) {
        super(message)
    }
}