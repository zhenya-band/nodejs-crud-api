import http from 'http';
import { v4 as uuidv4 } from 'uuid';

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

    async createUser(request: http.IncomingMessage): Promise<User> {
        const userRaw = await getBody(request);
        const user: CreateUser = JSON.parse(userRaw);

        this.usersValidator.validateCreateUserBody(user);

        const userWithId = { ...user, id: uuidv4() };

        this.users.push(userWithId);

        return userWithId;
    }
}

export default new UsersService(new UsersValidator());
