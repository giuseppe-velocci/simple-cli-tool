import VersionInfo from '../src/core/models/VersionInfo';
import VersionPrinterImpl from '../src/core/VersionPrinter'
import { ClIOTest, User } from './ClIO.test';

const versionInfo: VersionInfo = new VersionInfo('cmd', '1.0.0');
const user = new User();
const io = new ClIOTest(user);

describe('VersionPrinter', () => {
    test('should return name and version', () => {
        const target = new VersionPrinterImpl(io, versionInfo);
        target.printVersion();

        expect(io.printedValues).toStrictEqual(['cmd v1.0.0']);
    });
});