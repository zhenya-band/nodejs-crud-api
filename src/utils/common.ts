import http from 'http';

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
