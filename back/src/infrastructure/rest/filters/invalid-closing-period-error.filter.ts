import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { InvalidClosingPeriodError } from '../../../domain/invalid-closing-period.error';

@Catch(InvalidClosingPeriodError)
export class InvalidClosingPeriodErrorFilter implements ExceptionFilter {
  catch(exception: InvalidClosingPeriodError, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: HttpStatus = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      name: exception.name,
      message: exception.message,
    });
  }
}
