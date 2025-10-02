import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import tracer from '../tracing';

@Catch()
export class DatadogExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // LOG ERROR TO CONSOLE FIRST
    console.error('=== BACKEND ERROR CAUGHT ===');
    console.error(
      'Error type:',
      exception instanceof Error ? exception.constructor.name : 'Unknown',
    );
    console.error(
      'Error message:',
      exception instanceof Error ? exception.message : 'No message',
    );
    console.error(
      'Error stack:',
      exception instanceof Error ? exception.stack : 'No stack',
    );
    console.error('Request method:', request.method);
    console.error('Request URL:', request.url);
    console.error('Full error object:', JSON.stringify(exception, null, 2));
    console.error('=== END ERROR LOG ===');

    // Tag the current span with error information
    if (process.env.NODE_ENV === 'production') {
      const span = tracer.scope().active();
      if (span) {
        span.setTag('error', true);
        span.setTag(
          'error.type',
          exception instanceof Error ? exception.constructor.name : 'Unknown',
        );

        if (exception instanceof HttpException) {
          span.setTag('error.message', exception.message);
          span.setTag('http.status_code', exception.getStatus());
        } else if (exception instanceof Error) {
          span.setTag('error.message', exception.message);
          span.setTag('error.stack', exception.stack);
        }

        // Add request context
        span.setTag('http.method', request.method);
        span.setTag('http.url', request.url);
      }
    }

    // Return error response
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
