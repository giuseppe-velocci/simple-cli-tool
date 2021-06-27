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
        if (process.env.NODE_ENV === "development") {
            rl.question('', (line) => {
                action(line);
                rl.close();
            })
        } else {
            const line = process.argv.filter((v, i, d) => i > 1).join(' ');
            action(line);
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