import http from 'http';
import * as dotenv from 'dotenv';

import UsersService from './services/UsersService';
import { AppRoutes, Method, NOT_FOUND_MESSAGE } from './types/const';
import { catchApiError } from './utils/common';

dotenv.config();

const { PORT } = process.env;

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
    } else if (url === AppRoutes.USERS && method === Method.GET) {
        try {
            const users = UsersService.getUsers();

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(users));
        } catch (error) {
            catchApiError(error, response);
        }
    } else if (url === AppRoutes.USERS && method === Method.POST) {
        try {
            const createdUser = await UsersService.createUser(request);

            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(createdUser));
        } catch (error) {
            catchApiError(error, response);
        }
    } else if (userId && url.includes(AppRoutes.USERS) && method === Method.DELETE) {
        try {
            await UsersService.deleteUser(userId);

            response.writeHead(204);
            response.end();
        } catch (error) {
            catchApiError(error, response);
        }
    } else if (userId && url.includes(AppRoutes.USERS) && method === Method.PUT) {
        try {
            const updatedUser = await UsersService.updateUser(userId, request);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(updatedUser));
        } catch (error) {
            catchApiError(error, response);
        }
    } else {
        response.writeHead(404);
        response.end(NOT_FOUND_MESSAGE);
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
