import request from 'supertest';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

import server from '../index';
import { AppRoutes } from '../types/const';

const createUserData = {
    username: 'test name',
    age: 25,
    hobbies: ['swimming', 'dance'],
};

describe('api/users', () => {
    afterAll(() => {
        server.close();
    });

    let createdUserId: string = '';

    it('should return empty array if no users should (GET)', async () => {
        const response = await request(server)
            .get(AppRoutes.USERS)
            .expect(200);

        expect(response.body.users).toBeDefined();
        expect(response.body.users).toHaveLength(0);
    });

    it('should return 400 status code with message in case of incorrect body (POST)', async () => {
        const missingUsernameBody = {
            age: 25,
            hobbies: ['swimming', 'dance'],
        };

        const response = await request(server)
            .post(AppRoutes.USERS)
            .send(missingUsernameBody)
            .expect(400);

        expect(response.text).toBeDefined();
        expect(response.text).toBe('missing required field: username');
    });

    it('should create user with correct body OK (POST)', async () => {
        const response = await request(server)
            .post(AppRoutes.USERS)
            .send(createUserData)
            .expect(201);

        expect(response.body.id).toBeDefined();
        expect(validateUuid(response.body.id)).toBeTruthy();

        expect(response.body.username).toBe(createUserData.username);
        expect(response.body.age).toBe(createUserData.age);
        expect(response.body.hobbies).toHaveLength(createUserData.hobbies.length);

        for (let i = 0; i <= response.body.hobbies.length; i++) {
            expect(response.body.hobbies[i]).toBe(createUserData.hobbies[i]);
        }

        createdUserId = response.body.id;
    });

    it('should return user by userId (GET)', async () => {
        const response = await request(server)
            .get(`${AppRoutes.USERS}/${createdUserId}`)
            .expect(200);

        const {
            body: {
                username, age, hobbies, id,
            },
        } = response;

        expect(username).toEqual(createUserData.username);
        expect(age).toEqual(createUserData.age);
        expect(hobbies).toHaveLength(createUserData.hobbies.length);

        expect(id).toBeDefined();
        expect(validateUuid(id)).toBeTruthy();
    });
});

describe('should return correct errors get user by id (GET)', () => {
    afterAll(() => {
        server.close();
    });

    it('should return 400 status code in case of invalid id (GET)', async () => {
        const badId = 'not-a-uuid-id';

        const response = await request(server)
            .get(`${AppRoutes.USERS}/${badId}`)
            .expect(400);

        expect(response.text).toBe(`Not valid id: ${badId}`);
    });

    it('should return 404 if user not exist (GET)', async () => {
        const id = uuidv4();

        const response = await request(server)
            .get(`${AppRoutes.USERS}/${id}`)
            .expect(404);

        expect(response.text).toBe(`User with id=${id} doesn't exist`);
    });
});
