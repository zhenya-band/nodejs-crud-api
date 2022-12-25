import { StatusCodes } from '../types/const';

export default class ApiError extends Error {
    statusCode: StatusCodes;

    message: string;

    constructor(statusCode: StatusCodes, message: string) {
        super();

        this.statusCode = statusCode;
        this.message = message;
    }
}
