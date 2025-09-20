const requests = require('supertest');
const app = require('./index'); // Adjust the path as necessary

describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
        const res = await requests(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });
});