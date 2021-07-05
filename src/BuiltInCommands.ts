import { ClIOImpl } from "./core/ClIO";
import { Command } from "./core/models/CommandModels";
import HelpPrinter from "./core/HelpPrinter";
import VersionPrinter from "./core/VersionPrinter";

const io = ClIOImpl.getInstance();

export class BuiltInCommands {
    helpPrinter: HelpPrinter;
    versionPrinter: VersionPrinter;

    constructor(helpPrinter: HelpPrinter, versionPrinter: VersionPrinter) {
        this.helpPrinter = helpPrinter;
        this.versionPrinter = versionPrinter;
    }

    getCommands(): Array<Command> {
        return [
            new Command(
                'help', [], (_) => this.helpPrinter.printHelpForCommands()
            ),
            new Command(
                'version', [], (_) => this.versionPrinter.printVersion()
            ),
        ];
    }
}