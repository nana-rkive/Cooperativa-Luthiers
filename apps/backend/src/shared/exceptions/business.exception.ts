import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    public readonly code: string;

    constructor(
        code: string,
        message: string,
        httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
    ) {
        super({ code, message }, httpStatus);
        this.code = code;
    }
}
