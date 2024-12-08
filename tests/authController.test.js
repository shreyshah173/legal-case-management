const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const mongoose = require('mongoose');
const User = require('../models/userModel'); // Assuming this is the user model for authentication
const jwt = require('jsonwebtoken');
const config = require('../config'); // Assuming your JWT secret is in config

describe('Auth Controller', () => {
    beforeAll(async () => {
        // Connect to the test database
        const dbURI = 'mongodb://localhost:27017/cms_test_db'; // Use a test database
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        // Clean up the test database and close the connection
        await User.deleteMany(); // Clear the users collection
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const newUser = {
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'testpassword',
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should return 400 if the user already exists', async () => {
            const existingUser = {
                name: 'Existing User',
                email: 'existinguser@example.com',
                password: 'password123',
            };

            // Register the user once
            await new User(existingUser).save();

            const res = await request(app)
                .post('/api/auth/register')
                .send(existingUser);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Register a user to log in
            const user = new User({
                name: 'Login User',
                email: 'loginuser@example.com',
                password: 'loginpassword',
            });
            await user.save();
        });

        it('should log in an existing user and return a token', async () => {
            const loginDetails = {
                email: 'loginuser@example.com',
                password: 'loginpassword',
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginDetails);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 400 for invalid login credentials', async () => {
            const invalidLoginDetails = {
                email: 'loginuser@example.com',
                password: 'wrongpassword',
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(invalidLoginDetails);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });

    describe('GET /api/auth/verifyToken', () => {
        let token;

        beforeEach(() => {
            // Generate a token for the test
            const payload = { id: 'user_id', name: 'Test User' };
            token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
        });

        it('should verify a valid token', async () => {
            const res = await request(app)
                .get('/api/auth/verifyToken')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Token is valid');
        });

        it('should return 401 for an invalid or expired token', async () => {
            const invalidToken = jwt.sign({ id: 'user_id' }, 'wrong_secret', { expiresIn: '1h' });

            const res = await request(app)
                .get('/api/auth/verifyToken')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid token');
        });
    });
});
