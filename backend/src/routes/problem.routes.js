const express = require('express');
const problemRouter = express.Router();
const {
    createProblem,
    getAllProblems,
    getProblemBySlug,
    updateProblem,
    deleteProblem,
    togglePublish
} = require('../controllers/problem.controllers');

const auth = require("../middleware/auth.middleware");

problemRouter.get('/', getAllProblems);
problemRouter.get('/:slug', getProblemBySlug);

problemRouter.post('/', auth, createProblem);
problemRouter.put('/:id', auth, updateProblem);
problemRouter.delete('/:id', auth, deleteProblem);
problemRouter.patch('/:id/toggle', auth, togglePublish);

module.exports = problemRouter;