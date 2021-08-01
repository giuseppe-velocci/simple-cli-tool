import { Command, CliParam, Param, Flag, PropType, PropConstraint } from "./models/CommandModels";
import ParamError from "./models/ParamError";

export type Either<L, R> = L | R;

export interface InputParser {
    parseInput(input: Array<string>, command: Command): Either<ParamError, Record<string, any>>
}

export default class ParamExtractor implements InputParser {
    parseInput(input: Array<string>, command: Command): Either<ParamError, Record<string, any>> {
        const cliArguments = {};

        const matchError = this.findAndStoreParam(input, command, cliArguments);
        if (matchError)
            return matchError;

        // add missing flags as false
        this.storeFlagsDefaultValue(command, cliArguments);

        // check for Required param constraint
        const missingRequiredParamError = this.findMissingRequiredParams(command, cliArguments);
        if (missingRequiredParamError)
            return missingRequiredParamError;

        return cliArguments;
    }

    private findAndStoreParam(input: Array<string>, command: Command, cliArguments: Record<string, any>): ParamError {
        const inputCount = input.length;
        let i = 0;

        const findParamAtIndex = (index: number): CliParam => {
            const normalizedInput = input[index].toLowerCase();
            return command.params.find(x =>
                x.name === normalizedInput
                || `-${x.shortName}` === normalizedInput
                || (
                    `--${x.name}` === normalizedInput && x instanceof Flag
                )
            );
        }

        const increaseIndexConditional = (cliParam: CliParam, index: number): number => {
            const lowercaseInput = input.map(x => x.toLowerCase());
            if (lowercaseInput.find(x => x === cliParam.name || x === `-${cliParam.shortName}`)) {
                return index + 1;
            }

            return index;
        }

        const findRequiredParamsArgumentsPositionally = (): CliParam => {
            const firstRequiredParam = command.params.find(x => 
                x instanceof Param 
                && !cliArguments[x.name] 
                && x.constraint == PropConstraint.Required
            );
            
            return firstRequiredParam;
        }

        // todo --> ensure no duplicated values are allowed!
        while (i < inputCount) {
            let cliParamOption = findParamAtIndex(i) || findRequiredParamsArgumentsPositionally();
            if (cliParamOption) {
                i = increaseIndexConditional(cliParamOption, i);
                console.log(cliParamOption, input[i]);
                const storeOptionError = this.storeArguments(cliArguments, cliParamOption, input[i]);
                if (storeOptionError) {
                    return storeOptionError;
                }

            } else {
                const errorOption = this.storeChainedFlags(command, cliArguments, input[i]);
                if (errorOption)
                    return errorOption;
            }
            i++;
        }

        return;
    };

    private findMissingRequiredParams(command: Command, cliArguments: Record<string, any>): ParamError {
        const missingRequiredParam = command.params.find(cliParam => cliParam instanceof Param &&
            cliParam.constraint === PropConstraint.Required &&
            !cliArguments[cliParam.name])
        if (missingRequiredParam)
            return new ParamError(`Missing required parameter: ${missingRequiredParam.name}`);
        return undefined;
    }

    private storeChainedFlags(command: Command, cliArguments: Record<string, any>, paramString: string): ParamError {
        let unhandledInput: string = paramString.replace('-', '');
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

    private storeArguments(cliArguments: object, cliParam: CliParam, value?: string): ParamError {
        if (cliArguments[cliParam.name]) {
            return new ParamError(`Param: ${cliParam.name} already existing`);
        }

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

            if (isNaN(cliArguments[cliParam.name]) && cliParam.type != PropType.String) {
                return new ParamError(`Invalid argument type for param: ${cliParam.name}, ${PropType[cliParam.type]} expected`);
            }
        } else if (cliParam instanceof Flag) {
            cliArguments[cliParam.name] = value === 'false' ? false : true;
        } else {
            //... TODO error
        }

        return;
    }

}
