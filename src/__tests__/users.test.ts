import request from 'supertest';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

import server from '../index';
import { AppRoutes, NOT_FOUND_MESSAGE } from '../types/const';
import { User } from '../types/index';

const createUserData = {
    username: 'test name',
    age: 25,
    hobbies: ['swimming', 'dance'],
};

const createUserData2 = {
    username: 'test name 2',
    age: 20,
    hobbies: ['fishing'],
};

const createUserData3 = {
    username: 'test name 3',
    age: 30,
    hobbies: ['hob1', 'hob2', 'hob3'],
};

afterAll(() => {
    server.close();
});

const updateUserData3 = {
    username: 'updated test name 3',
    age: 45,
    hobbies: ['hob1', 'hob2', 'hob3', 'hob4'],
};

describe('case 1', () => {
    let createdUserId: string = '';

    it('should return empty array if no users (GET)', async () => {
        const response = await request(server)
            .get(AppRoutes.USERS)
            .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body).toHaveLength(0);
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

describe('case 2 (create 2 users -> delete first user)', () => {
    let createdUserId1 = '';

    it('should create user with correct body OK (POST)', async () => {
        const response1 = await request(server)
            .post(AppRoutes.USERS)
            .send(createUserData)
            .expect(201);

        createdUserId1 = response1.body.id;

        await request(server)
            .post(AppRoutes.USERS)
            .send(createUserData2)
            .expect(201);
    });

    it('should return array of users (GET)', async () => {
        const response = await request(server)
            .get(AppRoutes.USERS)
            .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body).toHaveLength(3);
    });

    it('should delete user by id (DELETE)', async () => {
        await request(server)
            .delete(`${AppRoutes.USERS}/${createdUserId1}`)
            .expect(204);
    });

    it('should return array with 1 user (GET)', async () => {
        const response = await request(server)
            .get(AppRoutes.USERS)
            .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body).toHaveLength(2);
        expect(response.body.find((user: User) => user.id === createdUserId1)).toBe(undefined);
    });
});

describe('case 3', () => {
    let createdUserId1 = '';

    it('should return 404 if request to non-existing endpoints (GET)', async () => {
        const response = await request(server)
            .get('/api/non-existing')
            .expect(404);

        expect(response.text).toBe(NOT_FOUND_MESSAGE);
    });

    it('create user (POST)', async () => {
        const response1 = await request(server)
            .post(AppRoutes.USERS)
            .send(createUserData3)
            .expect(201);

        createdUserId1 = response1.body.id;
    });

    it('update user (PUT)', async () => {
        const response = await request(server)
            .put(`${AppRoutes.USERS}/${createdUserId1}`)
            .send(updateUserData3)
            .expect(200);

        expect(response.body.id).toBe(createdUserId1);
        expect(response.body.username).toBe(updateUserData3.username);
        expect(response.body.hobbies).toHaveLength(4);
        expect(response.body.hobbies).toStrictEqual(updateUserData3.hobbies);
        expect(response.body.age).toBe(updateUserData3.age);
    });

    it('get updated user', async () => {
        const response = await request(server)
            .get(`${AppRoutes.USERS}/${createdUserId1}`)
            .send(updateUserData3)
            .expect(200);

        expect(response.body.id).toBe(createdUserId1);
        expect(response.body.username).toBe(updateUserData3.username);
        expect(response.body.hobbies).toStrictEqual(updateUserData3.hobbies);
        expect(response.body.age).toStrictEqual(updateUserData3.age);
    });

    it('updated user with wrong data (PUT)', async () => {
        const wrongData = { ...updateUserData3, username: null };

        const response = await request(server)
            .put(`${AppRoutes.USERS}/${createdUserId1}`)
            .send(wrongData)
            .expect(400);

        expect(response.text).toBe('missing required field: username');
    });

    it('delete updated user (DELETE)', async () => {
        await request(server)
            .delete(`${AppRoutes.USERS}/${createdUserId1}`)
            .expect(204);
    });

    it('delete not existing user (DELETE)', async () => {
        const response = await request(server)
            .delete(`${AppRoutes.USERS}/${createdUserId1}`)
            .expect(404);

        expect(response.text).toBe(`User with id: ${createdUserId1} not found`);
    });
});

describe('case 4: should return correct errors get user by id (GET)', () => {
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
