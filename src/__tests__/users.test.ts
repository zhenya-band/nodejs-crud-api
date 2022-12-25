import request from 'supertest';
import server from '../index';
import { AppRoutes } from '../types/const';

describe('get users', () => {
    afterAll(() => {
        server.close();
    });

    it('if no users should return empty array', async () => {
        const response = await request(server)
            .get(AppRoutes.USERS)
            .expect(200);

        expect(response.body.users).toBeDefined();
        expect(response.body.users).toHaveLength(0);
    });
});
