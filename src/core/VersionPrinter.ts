import { ClIO } from "./ClIO";
import VersionInfo from "./VersionInfo";

const getVersionInfo = (injectedInfo: VersionInfo) => {
    if (injectedInfo.name && injectedInfo.version)
        return injectedInfo;

    try {
        const info = require('../../package-info.js');
        return info;
    } catch {
        const info = require('../../dist/package-info.js');
        return info;
    }
}

export interface VersionPrinter {
    printVersion(): void;
}

export default class VersionPrinterImpl implements VersionPrinter {
    io: ClIO;
    packageInfo: VersionInfo;

    constructor(io: ClIO, injectedInfo: VersionInfo = new VersionInfo('', '')) {
       this.io = io;
       this.packageInfo = getVersionInfo(injectedInfo)
    }

    printVersion(): void {
        this.io.print(`${this.packageInfo.name} v${this.packageInfo.version}`);
    }
}
