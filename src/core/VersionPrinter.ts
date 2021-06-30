import { ClIO } from "./ClIO";
import * as fs from 'fs';

export interface VersionPrinter {
    printVersion(): void;
}

export default class VersionPrinterImpl implements VersionPrinter {
    io: ClIO;

    constructor(io: ClIO) {
       this.io = io;
    }

    printVersion(): void {
        const packageJson = fs.readFileSync('../package.json', 'utf8');
        const options = JSON.parse(packageJson);

        this.io.print(`${options.name} v${options.version}`);
    }

}