import http from 'http';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import ApiError from '../errors/ApiError';

import { CreateUser, User } from '../types/index';
import { getBody } from '../utils/common';
import UsersValidator, { UsersValidatorInterface } from './UsersValidator';

class UsersService {
    users: User[];

    usersValidator: UsersValidatorInterface;

    constructor(usersValidator: UsersValidatorInterface) {
        this.usersValidator = usersValidator;
        this.users = [];
    }

    getUsers(): User[] {
        return this.users;
    }

    getUser(userId: string): User {
        if (!validateUuid(userId)) throw new ApiError(400, `Not valid id: ${userId}`);

        const user = this.users.find((u) => u.id === userId);

        if (!user) throw new ApiError(404, `User with id=${userId} doesn't exist`);

        return user;
    }

    async createUser(request: http.IncomingMessage): Promise<User> {
        const userRaw = await getBody(request);
        const user: CreateUser = JSON.parse(userRaw);

        this.usersValidator.validateCreateUserBody(user);

        const userWithId = { ...user, id: uuidv4() };

        this.users.push(userWithId);

        return userWithId;
    }

    async deleteUser(userId: string): Promise<void> {
        if (!validateUuid(userId)) throw new ApiError(400, `Not valid id: ${userId}`);

        const userIndexForDelete = this.users.findIndex((user) => user.id === userId);
        if (userIndexForDelete === -1) throw new ApiError(404, `User with id: ${userId} not found`);

        this.users.splice(userIndexForDelete, 1);
    }

    async updateUser(userId: string, request: http.IncomingMessage): Promise<User> {
        const userRaw = await getBody(request);
        const userPayload: CreateUser = JSON.parse(userRaw);

        if (!validateUuid(userId)) throw new ApiError(400, `Not valid id: ${userId}`);

        const userForUpdate = this.users.find((user) => user.id === userId);
        if (!userForUpdate) throw new ApiError(404, `User with id: ${userId} not found`);

        this.usersValidator.validateCreateUserBody(userPayload);

        const updatedUserWithId = { ...userPayload, id: userForUpdate.id };
        this.users = this.users.map((user) => (user.id === userId ? updatedUserWithId : user));
        return updatedUserWithId;
    }
}

export default new UsersService(new UsersValidator());
