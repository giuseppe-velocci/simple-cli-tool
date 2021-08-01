import { Command, CliParam, Param, Flag, PropType, PropConstraint } from "./models/CommandModels";
import ParamError from "./models/ParamError";

export type Either<L, R> = L | R;

export interface InputParser {
    parseInput(input: Array<string>, command: Command): Either<ParamError, Record<string, any>>
}

export default class ParamExtractor implements InputParser {

    // command is matched by another method: this one only handles param extraction
    parseInput(input: Array<string>, command: Command): Either<ParamError, Record<string, any>> {
        const cliArguments = {};

        // const splitInput: Array<string> = this.normalizeInput(input, command);
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

        const findParamAtIndex = (index) : CliParam => {
            const normalizedInput = input[index].toLowerCase();
            return command.params.find(x => x.name == normalizedInput || `-${x.shortName}` == normalizedInput);
        }

        // todo --> ensure no duplicated values are allowed!
        while (i < inputCount) {
            let cliParamOption = findParamAtIndex(i);
            if (cliParamOption) {
                i++;
                this.storeArguments(cliArguments, cliParamOption, input[i]);
                
            } else {
                return new ParamError(`Invalid parameter ${input[i]}`);
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
