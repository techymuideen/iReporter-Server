const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/userRoutes');
const protect = require('../../middlewares/protect');
const userController = require('../../controllers/userController');
const AppError = require('../../utils/appError');

jest.mock('../../middlewares/protect');
jest.mock('../../controllers/userController');
jest.mock('../../utils/appError');

const app = express();
app.use(express.json());
app.use('/api/v1/users', userRouter);

describe('GET /api/v1/users', () => {
  it('should protect the route and call getAllUsers', async () => {
    protect.mockImplementation((req, res, next) => next());
    userController.getAllUsers.mockImplementation((req, res) =>
      res.status(200).json({ status: 'success', data: [] }),
    );

    const response = await request(app).get('/api/v1/users');

    expect(protect).toHaveBeenCalled();
    expect(userController.getAllUsers).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: [],
    });
  });
});

describe('GET /api/v1/users/:id', () => {
  it('should protect the route and call getUser', async () => {
    protect.mockImplementation((req, res, next) => next());
    userController.getUser.mockImplementation((req, res) =>
      res.status(200).json({ status: 'success', data: { id: req.params.id } }),
    );

    const response = await request(app).get('/api/v1/users/12345');

    expect(protect).toHaveBeenCalled();
    expect(userController.getUser).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '12345' } }),
      expect.anything(),
      expect.any(Function),
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: { id: '12345' },
    });
  });
});

describe('POST /api/v1/users', () => {
  it('should protect the route and call the user creation flow', async () => {
    protect.mockImplementation((req, res, next) => next());
    userController.createUser.mockImplementation((req, res) =>
      res.status(201).json({ status: 'success', data: { id: '12345' } }),
    );

    const response = await request(app)
      .post('/api/v1/users')
      .send({ name: 'New User', email: 'newuser@example.com' });

    expect(protect).toHaveBeenCalled();
    expect(userController.createUser).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: 'success',
      data: { id: '12345' },
    });
  });
});

describe('Users API', () => {
  describe('POST /api/v1/users', () => {
    it('should handle successful user creation', async () => {
      // Mock the protect middleware
      protect.mockImplementation((req, res, next) => next());

      // Mock the createUser controller
      userController.createUser.mockImplementation((req, res) => {
        res.status(201).json({
          status: 'success',
          data: { id: '12345', name: 'New User' },
        });
      });

      // Perform the request
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'New User', email: 'newuser@example.com' });

      // Assertions
      expect(protect).toHaveBeenCalled();
      expect(userController.createUser).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        data: { id: '12345', name: 'New User' },
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return a user by ID', async () => {
      // Mock the protect middleware
      protect.mockImplementation((req, res, next) => next());

      // Mock the getUser controller
      userController.getUser.mockImplementation((req, res) => {
        res.status(200).json({
          status: 'success',
          data: { id: req.params.id, name: 'Existing User' },
        });
      });

      // Perform the request
      const response = await request(app).get('/api/v1/users/12345');

      // Assertions
      expect(protect).toHaveBeenCalled();
      expect(userController.getUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: { id: '12345', name: 'Existing User' },
      });
    });
  });
});
