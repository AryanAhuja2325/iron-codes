const express = require('express');
const submissionRouter = express.Router();

const { createSubmission, getSubmission } = require('../controllers/submission.controllers');
const auth = require('../middleware/auth.middleware');

submissionRouter.post('/', auth, createSubmission);
submissionRouter.get('/:id', auth, getSubmission);

module.exports = submissionRouter;