const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

export interface ClIO {
    readline(action: (input: Array<string>) => void): void;
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

    readline(action: (input: Array<string>) => void): void {
        if (process.env.NODE_ENV === "development") {
            rl.question('', (line) => {
                action(line.split(' '));
                rl.close();
            })
        } else {
            const args = process.argv.filter((v, i, d) => i > 1);
            action(args);
            process.exit(0);
        }
    }

    print(message: string): void {
        console.log(message);
    }

    error(message: string): void {
        console.error(message);
    }
}