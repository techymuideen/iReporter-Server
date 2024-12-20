const express = require('express');
const reportController = require('../controllers/reportController');
const protect = require('../middlewares/protect');

const router = express.Router();

router
  .route('/')
  .get(protect, reportController.getAllReports)
  .post(
    protect,
    reportController.uploadReportFiles,
    reportController.handleReportFiles,
    reportController.addAuthor,
    reportController.createReport,
  );

router
  .route('/:id')
  .get(protect, reportController.getReport)
  .patch(
    protect,
    reportController.uploadReportFiles,
    reportController.handleReportFiles,
    reportController.addAuthor,
    reportController.updateReport,
  )
  .delete(protect, reportController.deleteReport);

router.route('/status/:id').patch(protect, reportController.changeReportStatus);

module.exports = router;
