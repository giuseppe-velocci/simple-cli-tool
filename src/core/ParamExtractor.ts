import { Command, CliParam, Param, Flag, PropType, PropConstraint } from "./CommandModels";

export type Either<L, R> = L | R;

export default class ParamExtractor {
    // command is matched by another method: this one only handles param extraction
    parseInput(input: string, command: Command): Either<ParamError, object> {
        const cliArguments = {};

        const findAndStoreParam = (match: (CliParam) => boolean, paramInput: string, value: any): ParamError => {
            const paramObject = command.params.find(match);
            if (!paramObject)
                return new ParamError(`Invalid parameter ${encodeURI(paramInput)}`);

            this.storeArguments(cliArguments, paramObject, value);
            return undefined;
        };

        if (!input)
            return new ParamError('Invalid expression');

        const splitInput: Array<string> = input.replace('--', '-_')
            .split('-')
            .filter(x => x !== '');

        // TODO rewrite with map...
        for (const segment of splitInput) {
            const [param, value] = segment.trim().split(' ');

            // match by extended or short name
            const paramString = (param.charAt(0) === '_') ?
                param.substring(1) :
                param;

            const matchingFunction = (param.charAt(0) === '_') ?
                ((x: CliParam) => x.name === paramString) :
                ((x: CliParam) => x.shortName === paramString);

            const matchError = findAndStoreParam(matchingFunction, paramString, value);
            if (matchError)
                return matchError
        }

        // add missing flags as false
        this.setFlagsDefaultValue(command, cliArguments);

        // check for Required param constraint
        const missingRequiredParamError = this.findMissingRequiredParams(command, cliArguments);
        if (missingRequiredParamError)
            return missingRequiredParamError;

        return cliArguments;
    }

    private setFlagsDefaultValue(command: Command, cliArguments: object): void {
        command.params.filter(cliParam => cliParam instanceof Flag && !cliArguments[cliParam.name])
            .map((flag) => this.storeArguments(cliArguments, flag, 'false'));
    }

    private findMissingRequiredParams(command: Command, cliArguments: object): ParamError {
        const missingRequiredParam = command.params.find(cliParam => cliParam instanceof Param &&
            cliParam.constraint === PropConstraint.Required &&
            !cliArguments[cliParam.name])
        if (missingRequiredParam)
            return new ParamError(`Missing required parameter: ${missingRequiredParam.name}`);
        return undefined;
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

    private searchChainedFlag(args: Array<string>): object {


        return {};
    }
}

export class ParamError extends Error {
    constructor(message: string) {
        super(message)
    }
}