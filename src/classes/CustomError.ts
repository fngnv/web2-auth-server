export default class CustomError extends Error {
    status = 400;

    constructor(msg: string, status: number) {
        super(msg);
        this.status = status;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}