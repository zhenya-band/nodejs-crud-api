import ApiError from '../errors/ApiError';
import { CreateUser } from '../types/index';

export interface UsersValidatorInterface {
    validateCreateUserBody(user: CreateUser): void;
}

class UsersValidator implements UsersValidatorInterface {
    validateCreateUserBody(user: CreateUser): void {
        if (!user.age) {
            throw new ApiError(400, 'missing required field: age');
        }

        if (!user.username) {
            throw new ApiError(400, 'missing required field: username');
        }

        if (!user.hobbies) {
            throw new ApiError(400, 'missing required field: hobbies');
        }

        if (typeof user.age !== 'number') {
            throw new ApiError(400, 'field age must be number');
        }

        if (typeof user.username !== 'string') {
            throw new ApiError(400, 'field username must be string');
        }

        if (!Array.isArray(user.hobbies)) {
            throw new ApiError(400, 'field hobbies must be array of string');
        }
    }
}

export default UsersValidator;
