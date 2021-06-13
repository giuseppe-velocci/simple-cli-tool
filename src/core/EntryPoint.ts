import { ClIO } from "./ClIO"
import { Command } from "./CommandModels"

class EntryPoint {
    io: ClIO;
    commands: Array<Command>;

    constructor(commands: Array<Command>, io: ClIO) {
        this.commands = commands;
        this.io = io;
    }

    start() {
        this.io.prompt(this.handleCommand);
    }

    private handleCommand(input: string) {
        const cmdInput = input.trim().split(' ')[0]; // TODO should be in position 0 or 1???
        if(!cmdInput)
            this.io.error('invalid input');
        
        const cmd = this.commands.find(c => c.name == cmdInput);

        if(!cmd)
            this.io.error('command not found');

        let parmasNames = this.extractParmasNames(cmd);
        
    }

    private extractParmasNames(cmd: Command) { // moved in class
        return cmd.params.map(c => c.name);
    }
}