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
        const version = JSON.parse(packageJson).version;

        this.io.print(`version: ${version}`);
    }

}