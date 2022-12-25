import http from 'http';
import ApiError from '../errors/ApiError';

export const getBody = (request: http.IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            resolve(body);
        });

        request.on('error', reject);
    });
};

export const catchApiError = (error: unknown, response: http.ServerResponse) => {
    if (error instanceof ApiError) {
        response.writeHead(error.statusCode);
        response.end(error.message);
    }
    response.writeHead(500);
    response.end();
};
