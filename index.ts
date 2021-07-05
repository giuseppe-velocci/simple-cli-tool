import EntryPoint from './src/core/EntryPoint';
import { ClIOImpl } from './src/core/ClIO';
import ParamExtractor from './src/core/ParamExtractor';
import HelpPrinterImpl from './src/core/HelpPrinter';
import VersionPrinterImpl from './src/core/VersionPrinter';
import { commands } from './src/commands';
import { BuiltInCommands } from './src/builtInCommands';

const io = ClIOImpl.getInstance();
const inputParser = new ParamExtractor();
const helpPrinter = new HelpPrinterImpl(io, commands);
const versionPrinter = new VersionPrinterImpl(io);
const builtInCommands = new BuiltInCommands(helpPrinter, versionPrinter).getCommands();

const entryPoint = new EntryPoint(commands, io, inputParser, helpPrinter, builtInCommands);
entryPoint.start();