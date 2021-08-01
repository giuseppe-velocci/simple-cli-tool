import { ClIO } from '../src/core/ClIO';

export class User {
    inputValues: Array<string>;

    constructor() {
        this.inputValues = [];
    }

    willInput(inputs: Array<string>) {
        this.inputValues = inputs;
    }
}

export class ClIOTest implements ClIO {
    user: User;
    printedValues: Array<string>;
    errorValues: Array<string>;

    constructor(user: User) {
        this.user = user;
        this.printedValues = [];
        this.errorValues = [];
    }

    readline(action: (choice: Array<string>) => void): void {
        const input: Array<string> = this.user.inputValues.length > 0 ?
            this.user.inputValues.shift().split(' ') :
            [];
        action(input);
    }

    print(message: string): void {
        this.printedValues.push(message);
    }

    error(message: string): void {
        this.errorValues.push(message);
    }
}

test('ClIOTest print should print the string passed in order', () => {
    const user: User = new User;
    const target = new ClIOTest(user);
    target.print('1');
    target.print('2');
    target.print('3');

    expect(target.printedValues).toStrictEqual(['1', '2', '3']);
});

test('ClIOTest error should print error messages passed in order', () => {
    const user: User = new User;
    const target = new ClIOTest(user);
    target.error('err 1');
    target.error('err 2');
    target.error('err 3');

    expect(target.errorValues).toStrictEqual(['err 1', 'err 2', 'err 3']);
});

test('ClIOTest readline should process user inputs in order', () => {
    const user: User = new User;
    user.willInput(['1', '2', '3']);
    const target = new ClIOTest(user);
    const testAction = (input: Array<string>) => target.print(input[0]);
    target.readline(testAction);
    target.readline(testAction);
    target.readline(testAction);    

    expect(target.printedValues).toStrictEqual(['1', '2', '3']);
});

test('ClIOTest readline should acquire an undefined if too many values are requested', () => {
    const user: User = new User;
    user.willInput([]);
    const target = new ClIOTest(user);
    const testAction = (input: Array<string>) => target.print(input[0]);
    target.readline(testAction);

    expect(target.printedValues).toStrictEqual([undefined]);
});
