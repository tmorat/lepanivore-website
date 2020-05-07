import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { FeatureNotFoundError } from '../../../domain/feature-not-found.error';

@Catch(FeatureNotFoundError)
export class FeatureNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: FeatureNotFoundError, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: HttpStatus = HttpStatus.NOT_FOUND;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      name: exception.name,
      message: exception.message,
    });
  }
}
