const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

export interface ClIO {
    readline(action: (input: string) => void): void;
    print(message: string): void;
    error(message: string): void;
}

export class ClIOImpl implements ClIO {
    private static instance: ClIOImpl;

    private constructor() {}

    static getInstance(){
        if (! ClIOImpl.instance)
            ClIOImpl.instance = new ClIOImpl();

        return ClIOImpl.instance;
    }

    readline(action: (input: string) => void): void {
        rl.question('', (line) => {
            action(line);
            rl.close();
        })
    }

    print(message: string): void {
        console.log(message);
    }

    error(message: string): void {
        console.error(message);
    }
}