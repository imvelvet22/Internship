const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');


router.get('/projects', projectController.findAll);
router.post('/projects', projectController.create);
router.put('/projects/:id', projectController.updateProject); 
router.delete('/projects/:id', projectController.delete);

module.exports = router;