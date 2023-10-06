export class CustomError extends Error {
    type?: string;
    field?: string;

    constructor(message: string, type?: string, field?: string) {
        super(message);
        this.type = type;
        this.field = field;
        this.name = 'CustomError';
    }
}