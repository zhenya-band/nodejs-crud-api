import http from 'http';
import ApiError from './Error/ApiError';
import UsersService from './services/UsersService';
import { AppRoutes, Method } from './types/const';

const PORT = 3000;

const server = http.createServer(async (request, response) => {
    const { url, method } = request;

    console.log('url', url);
    console.log('method', method);

    if (url === AppRoutes.USERS && method === Method.GET) {
        const users = UsersService.getUsers();

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ users }));
    }

    if (url === AppRoutes.USERS && method === Method.POST) {
        try {
            const createdUser = await UsersService.createUser(request);

            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(createdUser));
        } catch (error) {
            if (error instanceof ApiError) {
                response.writeHead(error.statusCode);
                response.end(JSON.stringify(error.message));
            }
            response.writeHead(500);
            response.end();
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
