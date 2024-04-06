import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const obj = exception.getResponse();
    const msg = JSON.parse(JSON.stringify(obj)).message;

    this.logger.error(msg, `${status} | ${request.url}`);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: msg,
      path: request.url,
    });
  }
}
