export class Command {
    name: string;
    params: Array<CliParam>;
    action: (params: object) => void;

    constructor(name:string, params: Array<CliParam>, action: ({params}) => void) {
        this.name = name;
        this.params = params;
        this.action = action;
    }
}

export interface CliParam {
    name: string;
    shortName: string;
    description: string;
}


export class Param implements CliParam {
    name: string;
    shortName: string;
    type: PropType;
    description: string;
    constraint: PropConstraint;

    constructor(name: string, shortName: string, type: PropType, constraint: PropConstraint, description: string) {
        this.name = name;
        this.shortName = shortName;
        this.type = type;
        this.constraint = constraint;
        this.description = description;
    }
}

// TODO short flags should be chainable -> -x -n -f == -xnf
export class Flag implements CliParam {
    name: string;
    shortName: string;
    description: string;

    constructor(name: string, shortName: string = '', description: string = '') {
        this.name = name;
        this.shortName = shortName;
        this.description = description;
    }
}

export enum PropType {
    Integer,
    Float,
    String,
}

export enum PropConstraint {
    None,
    Required,
    Excluding, // only one allowed among exclusive params
}