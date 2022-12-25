import http from 'http';
import UsersService from './services/UsersService';
import { AppRoutes, Method } from './types/const';
import { catchApiError } from './utils/common';

const PORT = 3000;

const server = http.createServer(async (request, response) => {
    const { url, method } = request;
    const userId = url?.split('/')[3];

    console.log('url', url);
    console.log('method', method);

    if (userId && url.includes(AppRoutes.USERS) && method === Method.GET) {
        try {
            const user = await UsersService.getUser(userId);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(user));
        } catch (error) {
            catchApiError(error, response);
        }
    }

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
            catchApiError(error, response);
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
