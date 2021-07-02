import { ClIO } from "./ClIO";

const getVersionInfo = () => {
    try {
        const info = require('../../package-info.js');
        return info;
    } catch {
        const info = require('../../dist/package-info.js');
        return info;
    }
}

const packageInfo = getVersionInfo();

export interface VersionPrinter {
    printVersion(): void;
}

export default class VersionPrinterImpl implements VersionPrinter {
    io: ClIO;

    constructor(io: ClIO) {
       this.io = io;
    }

    printVersion(): void {
        this.io.print(`${packageInfo.name} v${packageInfo.version}`);
    }
}
