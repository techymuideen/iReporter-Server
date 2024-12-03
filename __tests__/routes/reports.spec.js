const request = require('supertest');
const express = require('express');
const reportRouter = require('../routes/reportRoutes');
const protect = require('../middlewares/protect');
const reportController = require('../controllers/reportController');
const AppError = require('../utils/appError');

jest.mock('../middlewares/protect');
jest.mock('../controllers/reportController');
jest.mock('../utils/appError');

const app = express();
app.use(express.json());
app.use('/api/v1/reports', reportRouter);

describe('GET /api/v1/reports', () => {
  it('should protect the route and call getAllReports', async () => {
    protect.mockImplementation((req, res, next) => next());
    reportController.getAllReports.mockImplementation((req, res) =>
      res.status(200).json({ status: 'success', data: [] }),
    );

    const response = await request(app).get('/api/v1/reports');

    expect(protect).toHaveBeenCalled();
    expect(reportController.getAllReports).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: [],
    });
  });
});

describe('POST /api/v1/reports', () => {
  it('should protect the route and call the report creation flow', async () => {
    protect.mockImplementation((req, res, next) => next());
    reportController.uploadReportFiles.mockImplementation((req, res, next) =>
      next(),
    );
    reportController.handleReportFiles.mockImplementation((req, res, next) =>
      next(),
    );
    reportController.createReport.mockImplementation((req, res) =>
      res.status(201).json({ status: 'success', data: { id: '123' } }),
    );

    const response = await request(app)
      .post('/api/v1/reports')
      .send({ name: 'Test Report' });

    expect(protect).toHaveBeenCalled();
    expect(reportController.uploadReportFiles).toHaveBeenCalled();
    expect(reportController.handleReportFiles).toHaveBeenCalled();
    expect(reportController.createReport).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: 'success',
      data: { id: '123' },
    });
  });
});

describe('GET /api/v1/reports/:id', () => {
  it('should protect the route and call getReport', async () => {
    protect.mockImplementation((req, res, next) => next());
    reportController.getReport.mockImplementation((req, res) =>
      res.status(200).json({ status: 'success', data: { id: req.params.id } }),
    );

    const response = await request(app).get('/api/v1/reports/123');

    expect(protect).toHaveBeenCalled();
    expect(reportController.getReport).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '123' } }),
      expect.anything(),
      expect.any(Function),
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: { id: '123' },
    });
  });
});

describe('DELETE /api/v1/reports/:id', () => {
  it('should protect the route and call deleteReport', async () => {
    protect.mockImplementation((req, res, next) => next());
    reportController.deleteReport.mockImplementation((req, res) =>
      res.status(204).send(),
    );

    const response = await request(app).delete('/api/v1/reports/123');

    expect(protect).toHaveBeenCalled();
    expect(reportController.deleteReport).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '123' } }),
      expect.anything(),
      expect.any(Function),
    );
    expect(response.status).toBe(204);
  });
});

describe('Reports API', () => {
  describe('POST /api/v1/reports', () => {
    it('should handle successful report creation', async () => {
      // Mock the protect middleware
      protect.mockImplementation((req, res, next) => next());

      // Mock middlewares to pass without errors
      reportController.uploadReportFiles.mockImplementation((req, res, next) =>
        next(),
      );
      reportController.handleReportFiles.mockImplementation((req, res, next) =>
        next(),
      );

      // Mock the createReport controller
      reportController.createReport.mockImplementation((req, res) => {
        res.status(201).json({
          status: 'success',
          data: { id: '12345', name: 'New Report' },
        });
      });

      // Perform the request
      const response = await request(app)
        .post('/api/v1/reports')
        .send({ name: 'New Report' });

      // Assertions
      expect(protect).toHaveBeenCalled();
      expect(reportController.uploadReportFiles).toHaveBeenCalled();
      expect(reportController.handleReportFiles).toHaveBeenCalled();
      expect(reportController.createReport).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        data: { id: '12345', name: 'New Report' },
      });
    });
  });

  describe('GET /api/v1/reports/:id', () => {
    it('should return a report by ID', async () => {
      // Mock the protect middleware
      protect.mockImplementation((req, res, next) => next());

      // Mock the getReport controller
      reportController.getReport.mockImplementation((req, res) => {
        res.status(200).json({
          status: 'success',
          data: { id: req.params.id, name: 'Existing Report' },
        });
      });

      // Perform the request
      const response = await request(app).get('/api/v1/reports/12345');

      // Assertions
      expect(protect).toHaveBeenCalled();
      expect(reportController.getReport).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: { id: '12345', name: 'Existing Report' },
      });
    });
  });
});
