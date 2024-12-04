const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/userRoutes');
const protect = require('../../middlewares/protect');
const authController = require('../../controllers/authController');
const userController = require('../../controllers/userController');
const AppError = require('../../utils/appError');

jest.mock('../../middlewares/protect');
jest.mock('../../controllers/authController');
jest.mock('../../controllers/userController');
jest.mock('../../utils/appError');

// Testing

const app = express();
app.use(express.json());
app.use('/api/v1/users', userRouter);

describe('POST /api/v1/users/signup', () => {
  it('should call the signup controller', async () => {
    authController.signup.mockImplementation((req, res) =>
      res.status(201).json({
        status: 'success',
        data: { id: '12345', email: 'test@example.com' },
      }),
    );

    const response = await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(authController.signup).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: 'success',
      data: { id: '12345', email: 'test@example.com' },
    });
  });
});

describe('POST /api/v1/users/login', () => {
  it('should call the login controller', async () => {
    authController.login.mockImplementation((req, res) =>
      res.status(200).json({ status: 'success', token: 'jwt-token' }),
    );

    const response = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(authController.login).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      token: 'jwt-token',
    });
  });
});

describe('GET /api/v1/users/me', () => {
  it('should protect the route and call getUser with the correct ID', async () => {
    // Mock protect middleware to call next immediately
    protect.mockImplementation((req, res, next) => next());

    userController.getMe.mockImplementation((req, res, next) => {
      req.params.id = req.user.id;
      next();
    });

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

describe('Auth API', () => {
  describe('POST /api/v1/users/signup', () => {
    it('should handle successful signup', async () => {
      authController.signup.mockImplementation((req, res) =>
        res.status(201).json({
          status: 'success',
          data: { id: '67890', email: 'newuser@example.com' },
        }),
      );

      const response = await request(app)
        .post('/api/v1/users/signup')
        .send({ email: 'newuser@example.com', password: 'securepassword' });

      expect(authController.signup).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        data: { id: '67890', email: 'newuser@example.com' },
      });
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should handle successful login', async () => {
      authController.login.mockImplementation((req, res) =>
        res.status(200).json({
          status: 'success',
          token: 'valid-jwt-token',
        }),
      );

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'existinguser@example.com', password: 'mypassword' });

      expect(authController.login).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        token: 'valid-jwt-token',
      });
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return the current user', async () => {
      protect.mockImplementation((req, res, next) => next());

      userController.getMe.mockImplementation((req, res, next) => {
        req.params.id = req.user.id;
        next();
      });

      userController.getUser.mockImplementation((req, res) => {
        res.status(200).json({
          status: 'success',
          data: { id: req.params.id, name: 'Current User' },
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
        data: { id: '12345', name: 'Current User' },
      });
    });
  });

  it('should return an error if the user is not logged in', async () => {
    // Mock protect middleware to simulate no user being logged in
    protect.mockImplementation((req, res, next) => {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    });

    // Perform the request
    const response = await request(app).get('/api/v1/users/me');

    // Assertions
    expect(protect).toHaveBeenCalled(); // Ensure protect middleware is called
    expect(response.status).toBe(401); // Assert the correct status code
    expect(response.body).toEqual({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.',
    }); // Assert the response body
  });
});
