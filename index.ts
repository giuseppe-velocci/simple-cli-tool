import { Command, Flag, Param, PropConstraint, PropType } from './src/core/CommandModels';
import EntryPoint from './src/core/EntryPoint';
import { ClIOImpl } from './src/core/ClIO';
import ParamExtractor from './src/core/ParamExtractor';
import HelpPrinterImpl from './src/core/HelpPrinter';
import VersionPrinterImpl from './src/core/VersionPrinter';
import { commands } from './src/commands';

const io = ClIOImpl.getInstance();
const inputParser = new ParamExtractor();
const helpPrinter = new HelpPrinterImpl(io);
const versionPrinter = new VersionPrinterImpl(io);

const entryPoint = new EntryPoint(commands, io, inputParser, helpPrinter, versionPrinter);
entryPoint.start();