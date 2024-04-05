import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  resLogger = new Logger('ResponseLog');

  reqLogger = new Logger('RequestLog');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, path: url, ip } = req;
    const userAgent = req.get('user-agent') || '';
    this.reqLogger.debug(`${method} | ${url}`);

    res.on('close', () => {
      const { statusCode } = res;

      this.resLogger.log(
        `${method} | ${url} | ${statusCode} | ${userAgent} | ${ip}`,
      );
    });
    next();
  }
}
